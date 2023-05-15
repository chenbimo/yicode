import assert from 'assert';
import path from 'path';
import { init, parse } from 'es-module-lexer';
import MagicString from 'magic-string';

import { staticImportedScan } from './staticImportScan';
import { isCSSIdentifier } from './helper';
import { normalizePath, resolveEntry } from './utils';

const SPLIT_DEFAULT_MODULES = {
    __commonjsHelpers__: [/commonjsHelpers/]
};

const cache = new Map();

const wrapCustomSplitConfig = async (manualChunks, customOptions, customChunk, root) => {
    assert(typeof manualChunks === 'function');
    const groups = Object.keys(customOptions);
    // Create cache ahead of time to decrease the cost of resolve.sync!
    const depsInGroup = {};
    for (const group of groups) {
        const packageInfo = customOptions[group];
        depsInGroup[group] = await Promise.all(packageInfo.filter((item) => typeof item === 'string').map((item) => resolveEntry(item, root)));
        depsInGroup[group] = depsInGroup[group].filter((item) => item.length > 0);
    }
    return (moduleId, { getModuleIds, getModuleInfo }) => {
        const isDepInclude = (id, depPaths, importChain) => {
            // compat windows
            id = normalizePath(id);
            const key = `${id}-${depPaths.join('|')}`;

            // circular dependency
            if (importChain.includes(id)) {
                cache.set(key, false);
                return false;
            }
            if (cache.has(key)) {
                return cache.get(key);
            }
            // hit
            if (depPaths.includes(id)) {
                importChain.forEach((item) => cache.set(`${item}-${depPaths.join('|')}`, true));
                return true;
            }
            const moduleInfo = getModuleInfo(id);
            if (!moduleInfo || !moduleInfo.importers) {
                cache.set(key, false);
                return false;
            }
            const isInclude = moduleInfo.importers.some((importer) => isDepInclude(importer, depPaths, importChain.concat(id)));
            // set cache, important!
            cache.set(key, isInclude);
            return isInclude;
        };

        const id = normalizePath(moduleId);
        const chunk = customChunk({
            id,
            moduleId,
            root,
            file: normalizePath(path.relative(root, id))
        });
        if (chunk) {
            return chunk;
        }

        for (const group of groups) {
            const deps = depsInGroup[group];
            const packageInfo = customOptions[group];
            if (!isCSSIdentifier(moduleId)) {
                if (moduleId.includes('node_modules') && deps.length && isDepInclude(moduleId, deps, [])) {
                    return group;
                }
                for (const rule of packageInfo) {
                    if (rule instanceof RegExp && rule.test(moduleId)) {
                        return group;
                    }
                }
            }
        }
        return manualChunks(moduleId, { getModuleIds, getModuleInfo });
    };
};

const generateManualChunks = async (splitOptions, root) => {
    const { strategy = 'default', customSplitting = {}, customChunk = () => null } = splitOptions;

    if (strategy === 'all-in-one') {
        return wrapCustomSplitConfig(() => null, customSplitting, customChunk, root);
    }

    if (strategy === 'unbundle') {
        return wrapCustomSplitConfig(
            (id, { getModuleInfo }) => {
                if (id.includes('node_modules') && !isCSSIdentifier(id)) {
                    if (staticImportedScan(id, getModuleInfo, new Map(), [])) {
                        return 'vendor';
                    } else {
                        return 'async-vendor';
                    }
                }
                const cwd = process.cwd();
                if (!id.includes('node_modules') && !isCSSIdentifier(id)) {
                    const extname = path.extname(id);
                    return normalizePath(path.relative(cwd, id).replace(extname, ''));
                }
            },
            {
                ...SPLIT_DEFAULT_MODULES,
                ...customSplitting
            },
            customChunk,
            root
        );
    }

    return wrapCustomSplitConfig(
        (id, { getModuleInfo }) => {
            if (id.includes('node_modules') && !isCSSIdentifier(id)) {
                if (staticImportedScan(id, getModuleInfo, new Map(), [])) {
                    return 'vendor';
                }
            }
        },
        {
            ...SPLIT_DEFAULT_MODULES,
            ...customSplitting
        },
        customChunk,
        root
    );
};

export function chunkSplitPlugin(
    splitOptions = {
        strategy: 'default'
    }
) {
    return {
        name: 'yite-chunk',
        async config(c) {
            await init;
            const root = normalizePath(c.root || process.cwd());
            const manualChunks = await generateManualChunks(splitOptions, root);
            return {
                build: {
                    rollupOptions: {
                        output: {
                            manualChunks
                        }
                    }
                }
            };
        },
        // Delete useless import in commonjsHelpers.js, which is generated by @rollup/plugin-commonjs
        // https://github.com/sanyuan0704/vite-plugin-chunk-split/issues/8
        async renderChunk(code, chunk) {
            const s = new MagicString(code);
            if (chunk.fileName.includes('__commonjsHelpers__')) {
                const [imports] = parse(code);
                for (const { ss: start, se: end } of imports) {
                    s.remove(start, end);
                }
                return {
                    code: s.toString(),
                    map: s.generateMap({ hires: true })
                };
            }
            return {
                code: code,
                map: chunk.map || s.generateMap({ hires: true })
            };
        }
    };
}
