import path from 'node:path';
import { defineConfig } from 'vite';
import viteVue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import * as ComponentResolvers from 'unplugin-vue-components/resolvers';
import { visualizer as Visualizer } from 'rollup-plugin-visualizer';
import vueI18n from '@intlify/unplugin-vue-i18n/vite';
import { chunkSplitPlugin as ChunkSplit } from '@yicode/yivite-chunk';
// import { viteZip as ZipFile } from 'vite-plugin-zip-file';
import Inspect from 'vite-plugin-inspect';
import fs from 'fs-extra';
import portfinder from 'portfinder';
import { createHtmlPlugin } from 'vite-plugin-html';
import { mergeAndConcat } from 'merge-anything';
import Unocss from 'unocss/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
// import topLevelAwait from 'vite-plugin-top-level-await';
import ReactivityTransform from '@vue-macros/reactivity-transform/vite';
import VueRouter from 'unplugin-vue-router/vite';
import { VueRouterAutoImports } from 'unplugin-vue-router';
import Layouts from 'vite-plugin-vue-layouts';

// unocss相关配置
import { defineConfig as defineUnocssConfig, presetAttributify, presetUno, presetIcons } from 'unocss';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerCompileClass from '@unocss/transformer-compile-class';
import transformerDirectives from '@unocss/transformer-directives';

import { yidashLibNames } from '@yicode/yidash/yidashLibNames.js';

import { cliDir, appDir, srcDir, yicodeDir, cacheDir } from './config.js';
import { fnFileProtocolPath, fnOmit, fnImport } from './utils.js';

export default defineConfig(async ({ command, mode }) => {
    // 没有则生成目录
    fs.ensureDirSync(cacheDir);
    fs.ensureDirSync(yicodeDir);

    const { yiviteConfig } = await fnImport(fnFileProtocolPath(path.resolve(yicodeDir, 'yivite.config.js')), 'yiviteConfig', {});
    let pkg = fs.readJsonSync(path.resolve(appDir, 'package.json'), { throws: false }) || {};

    let findPort = await portfinder.getPortPromise({ port: 8000, stopPort: 9000 });

    // 每个项目依赖包进行分割
    let splitDependencies = {};
    let includeDeps = [];
    for (let prop in pkg.dependencies) {
        if (pkg.dependencies.hasOwnProperty(prop)) {
            splitDependencies[prop] = [prop];
            includeDeps.push(prop);
        }
    }

    // vue 插件
    let viteVuePlugin = {};

    // 自动导入插件
    let autoImportPlugin = mergeAndConcat(
        {
            include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
            imports: [
                'vue',
                'vue-i18n',
                'pinia',
                VueRouterAutoImports,
                {
                    'lodash-es': [
                        //
                        ['*', '_']
                    ],
                    '@yicode/yidash': yidashLibNames
                }
            ],
            dirs: [
                //
                path.resolve(srcDir, 'plugins'),
                path.resolve(srcDir, 'hooks'),
                path.resolve(srcDir, 'utils'),
                path.resolve(srcDir, 'stores'),
                path.resolve(srcDir, 'config')
            ],
            defaultExportByFilename: true,
            vueTemplate: true,
            dts: '.cache/auto-imports.d.ts',
            resolvers: []
        },
        fnOmit(yiviteConfig?.autoImport || {}, ['resolvers']),
        {
            resolvers: yiviteConfig?.autoImport?.resolvers?.map((item) => ComponentResolvers[item.name](item.options)) || []
        }
    );

    // i18n 插件
    let vueI18nPlugin = {
        include: path.resolve(srcDir, 'i18n/**')
    };

    // 自动导入组件
    let componentsPlugin = {
        dirs: [
            //
            path.resolve(srcDir, 'components')
        ],
        dts: '.cache/components.d.ts',
        version: 3,
        directoryAsNamespace: false,
        resolvers: [IconsResolver()]
    };

    let unocssPlugin = defineUnocssConfig(
        Object.assign(
            {
                presets: [
                    //
                    presetUno(),
                    presetAttributify()
                ],
                transformers: [
                    //
                    transformerDirectives(),
                    transformerVariantGroup(),
                    transformerCompileClass()
                ],
                rules: [
                    //
                    [
                        //
                        'absolute',
                        {
                            position: 'absolute'
                        }
                    ],
                    [
                        //
                        'relative',
                        {
                            position: 'relative'
                        }
                    ]
                ]
            },
            yiviteConfig?.unocssConfig || {}
        )
    );

    // 代码分割

    // id: 'D:/codes/chensuiyi/yicode.tech/site.yicode.tech/node_modules/.pnpm/axios@1.3.4/node_modules/axios/lib/helpers/isURLSameOrigin.js',
    // moduleId: 'D:/codes/chensuiyi/yicode.tech/site.yicode.tech/node_modules/.pnpm/axios@1.3.4/node_modules/axios/lib/helpers/isURLSameOrigin.js',
    // root: 'D:/codes/chensuiyi/yicode.tech/site.yicode.tech',
    // file: 'node_modules/.pnpm/axios@1.3.4/node_modules/axios/lib/helpers/isURLSameOrigin.js'
    let chunkSplitPlugin = {
        strategy: 'default',
        // customChunk: (args) => {
        //     if (args.file.endsWith('.png')) {
        //         return 'png';
        //     }
        //     return null;
        // },
        customSplitting: Object.assign(splitDependencies, yiviteConfig?.chunkSplit || {})
    };

    // zip 压缩
    // let zipPlugin = {
    //     folderPath: path.resolve(appDir, 'dist'),
    //     outPath: cacheDir,
    //     zipName: yiviteConfig?.viteZip?.zipName || 'dist.zip',
    //     enabled: mode === 'production' ? true : false
    // };

    // 可视化报告
    let visualizerPlugin = {
        open: false,
        brotliSize: true,
        filename: '.cache/buildReport.html'
    };

    // 调试配置
    let inspectPlugin = {
        outputDir: cacheDir
    };

    // 打包入口配置
    let htmlTemplatePlugin = {
        template: '/index.html',
        entry: mode === 'production' ? 'src/main.js' : 'src/devMain.js'
    };

    // 正式环境下，才启用自动解析，避免页面重载
    if (mode === 'production') {
        // 自动导入方法，不需要按需，只要组件按需
        // autoImportPlugin = mergeAndConcat(
        //     //
        //     autoImportPlugin,
        //     fnOmit(yiviteConfig?.autoImport || {}, ['resolvers']),
        //     {
        //         resolvers: yiviteConfig?.autoImport?.resolvers?.map((item) => ComponentResolvers[item.name](item.options)) || []
        //     }
        // );

        // 自动导入组件
        componentsPlugin = mergeAndConcat(
            //
            componentsPlugin,
            fnOmit(yiviteConfig?.autoComponent || {}, ['resolvers']),
            {
                resolvers:
                    yiviteConfig?.autoComponent?.resolvers?.map((item) => {
                        return ComponentResolvers[item.name](item.options);
                    }) || []
            }
        );
    }

    let iconsPlugin = {
        autoInstall: false
    };

    let topLevelAwaitPlugin = {
        // The export name of top-level await promise for each chunk module
        promiseExportName: '__tla',
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: (i) => `__tla_${i}`
    };

    let vueRouterAutoPlugin = {
        dts: '.cache/typed-router.d.ts'
    };

    let layoutPlugin = {
        layoutsDirs: 'src/layouts',
        defaultLayout: 'default'
    };

    // 插件列表
    let allPlugins = [];
    allPlugins.push(ReactivityTransform());
    allPlugins.push(Unocss(unocssPlugin));
    allPlugins.push(Icons(iconsPlugin));
    allPlugins.push(VueRouter(vueRouterAutoPlugin));

    allPlugins.push(Components(componentsPlugin));
    allPlugins.push(AutoImport(autoImportPlugin));
    allPlugins.push(vueI18n(vueI18nPlugin));
    allPlugins.push(ChunkSplit(chunkSplitPlugin));
    // allPlugins.push(ZipFile(zipPlugin));
    allPlugins.push(Visualizer(visualizerPlugin));
    allPlugins.push(Inspect(inspectPlugin));
    allPlugins.push(createHtmlPlugin(htmlTemplatePlugin));
    allPlugins.push(viteVue(viteVuePlugin));
    allPlugins.push(Layouts(layoutPlugin));
    // allPlugins.push(topLevelAwait.default(topLevelAwaitPlugin));

    let viteConfig = mergeAndConcat(
        {
            plugins: allPlugins,
            css: {
                preprocessorOptions: {
                    scss: {
                        additionalData: `@use "@/styles/variable.scss" as *;`
                    }
                }
            },
            resolve: {
                alias: [
                    {
                        find: '@',
                        replacement: path.resolve(srcDir)
                    }
                ]
            },
            optimizeDeps: {
                include: []
            },
            root: appDir,
            base: './',
            envDir: path.resolve(srcDir, 'env'),
            logLevel: 'info',
            build: {
                reportCompressedSize: false,
                chunkSizeWarningLimit: 4096,
                target: ['es2022'],
                rollupOptions: {
                    plugins: [],
                    output: {
                        // TODO: 进一步研究
                        // assetFileNames: ({ name }) => {
                        //     if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
                        //         return 'assets/images/[name]-[hash][extname]';
                        //     }
                        //     if (/\.css$/.test(name ?? '')) {
                        //         return 'assets/css/[name]-[hash][extname]';
                        //     }
                        //     }
                        //     return 'assets/[name]-[hash][extname]';
                        // }
                    }
                }
            },
            server: {
                host: '0.0.0.0',
                port: findPort
            }
        },
        yiviteConfig?.viteConfig || {}
    );

    return viteConfig;
});
