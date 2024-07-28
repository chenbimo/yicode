import path from 'node:path';
import { defineConfig as defineViteConfig } from 'vite';
import viteVue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import * as ComponentResolvers from 'unplugin-vue-components/resolvers';
import logSymbols from 'log-symbols';
import { visualizer } from 'rollup-plugin-visualizer';

// import { viteZip as ZipFile } from 'vite-plugin-zip-file';
import { ensureDirSync, readJsonSync, outputJsonSync } from 'fs-extra/esm';
import portfinder from 'portfinder';

import { mergeAndConcat } from 'merge-anything';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import ReactivityTransform from '@vue-macros/reactivity-transform/vite';
import VueDevTools from 'vite-plugin-vue-devtools';
// import Markdown from 'vite-plugin-md';

// 内部文件
import { yiteRouter } from './plugins/router.js';
import { yiteI18n } from './plugins/i18n.js';
import { fnFileProtocolPath, fnOmit, fnImport, fnAppDir } from './utils.js';

const appDir = fnAppDir(process.env.YITE_CLI_WORK_DIR);

export default defineViteConfig(async ({ command, mode }) => {
    // 没有则生成目录
    ensureDirSync(appDir, '.cache');
    const yiteConfigPath = fnFileProtocolPath(path.resolve(appDir, 'yite.config.js'));
    const { yiteConfig } = await fnImport(yiteConfigPath, 'yiteConfig', {});
    if (!yiteConfig.viteConfig) {
        console.log(`${logSymbols.error} 请确认是否存在 yite.config.js 文件`);
        process.exit();
    }

    const pkg = readJsonSync(path.resolve(appDir, 'package.json'), { throws: false }) || {};

    const findPort = await portfinder.getPortPromise({ port: 8000, stopPort: 9000 });

    // 每个项目依赖包进行分割
    // let splitDependencies = {};
    // let includeDeps = [];
    // for (let prop in pkg.dependencies) {
    //     if (pkg.dependencies.hasOwnProperty(prop)) {
    //         splitDependencies[prop] = [prop];
    //         includeDeps.push(prop);
    //     }
    // }

    // 自动导入插件
    const autoImportConfig = mergeAndConcat(
        {
            include: [
                //
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/ // .md
            ],
            imports: [
                'vue',
                {
                    'vue-router': [
                        //
                        'useRouter',
                        'useRoute',
                        'useLink',
                        'onBeforeRouteLeave',
                        'onBeforeRouteUpdate',
                        'createMemoryHistory',
                        'createRouter',
                        'createWebHashHistory',
                        'createWebHistory',
                        'isNavigationFailure',
                        'loadRouteLocation'
                    ],
                    pinia: [
                        //
                        ['*', 'Pinia']
                    ],
                    'vue-i18n': [
                        //
                        'createI18n'
                    ]
                }
            ],
            dirs: [
                //
                path.resolve(appDir, 'src', 'plugins'),
                path.resolve(appDir, 'src', 'hooks'),
                path.resolve(appDir, 'src', 'utils'),
                path.resolve(appDir, 'src', 'stores'),
                path.resolve(appDir, 'src', 'config')
            ],
            defaultExportByFilename: true,
            vueTemplate: true,
            dts: '.cache/auto-imports.d.ts',
            resolvers: []
        },
        fnOmit(yiteConfig?.autoImport || {}, ['resolvers']),
        {
            resolvers: yiteConfig?.autoImport?.resolvers?.map((item) => ComponentResolvers[item.name](item.options)) || []
        }
    );

    // 自动导入组件
    const componentsConfig = mergeAndConcat(
        {
            dirs: [
                //
                path.resolve(appDir, 'src', 'components')
            ],
            dts: '.cache/components.d.ts',
            version: 3,
            directoryAsNamespace: true,
            resolvers: [IconsResolver()]
        },
        fnOmit(yiteConfig?.autoComponent || {}, ['resolvers']),
        {
            resolvers:
                yiteConfig?.autoComponent?.resolvers?.map((item) => {
                    return ComponentResolvers[item.name](item.options);
                }) || []
        }
    );

    // 代码分割
    // let chunkSplitConfig = {
    // strategy: 'default',
    // customChunk: (args) => {
    //     if (args.file.endsWith('.png')) {
    //         return 'png';
    //     }
    //     return null;
    // },
    // customSplitting: Object.assign(splitDependencies, yiteConfig?.chunkSplit || {})
    // };

    // 插件列表
    let allPlugins = [];

    // allPlugins.push(Markdown()) ;
    allPlugins.push(yiteRouter({}));
    allPlugins.push(yiteI18n({}));
    allPlugins.push(ReactivityTransform());
    allPlugins.push(
        Icons({
            compiler: 'vue3'
        })
    );

    allPlugins.push(Components(componentsConfig));
    allPlugins.push(AutoImport(autoImportConfig));
    // allPlugins.push(ChunkSplit(chunkSplitConfig));
    // 默认不使用二维码，多个网卡情况下会很乱
    // allPlugins.push(YiteQrcode());
    // allPlugins.push(ZipFile(zipPlugin));
    allPlugins.push(
        visualizer({
            filename: '.cache/stats.html',
            title: pkg?.name || '编译可视化'
        })
    );
    allPlugins.push(
        viteVue({
            include: [/\.vue$/, /\.md$/],
            ...(yiteConfig?.pluginsConfig?.vue || {})
        })
    );

    if (yiteConfig?.devtool === true) {
        allPlugins.push(VueDevTools({}));
    }

    const viteConfig = mergeAndConcat(
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
                        replacement: path.resolve(appDir, 'src')
                    },
                    {
                        find: 'vue-i18n',
                        replacement: 'vue-i18n/dist/vue-i18n.esm-bundler.js'
                    }
                ]
            },
            optimizeDeps: {
                include: []
            },
            root: appDir,
            base: './',
            envDir: path.resolve(appDir, 'src', 'env'),
            logLevel: 'info',
            build: {
                reportCompressedSize: false,
                chunkSizeWarningLimit: 4096,
                target: ['es2022'],
                rollupOptions: {
                    plugins: [],
                    output: {
                        // TODO: 进一步研究 22
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
                port: findPort,
                watch: {
                    ignored: ['**/node_modules/**/*', '**/.git/**/*']
                }
            }
        },
        yiteConfig?.viteConfig || {}
    );
    outputJsonSync(path.resolve(appDir, '.cache', 'vite-config.json'), viteConfig);
    return viteConfig;
});
