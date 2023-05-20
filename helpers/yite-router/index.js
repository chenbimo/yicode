// 查找模块
const importGlob = async (pattern, sync = false) => {
    return `import.meta.glob("${pattern}", {eager: ${sync}})`;
};

// 生成虚拟模块
const createVirtualModuleCode = async (options) => {
    return `
    export const yiteRoutes = () => {
        let routeFiles = ${await importGlob('@/pages/**/route.js', true)};
        let pageFiles = ${await importGlob('@/pages/**/index.vue')};
        let layoutFiles = ${await importGlob('@/layouts/*/index.vue')};

        let routes = [];

        for (let file in routeFiles) {
            let routePath = file.replace('/route.js', '').replace(/.*\\/pages/, '').toLowerCase().replace(/[\\s_-]+/g, '-');
            let mod = routeFiles[file];
            let routeData = {
                meta: mod.default || {}
            };

            routeData.path = routePath === '/index' ? '/' : routePath;
            if (routeData.meta.layout !== undefined && routeData.meta.layout === false) {
                routeData.component = pageFiles[file.replace('/route.js', '/index.vue')];
            } else {
                if (routeData.meta.layout !== undefined) {
                    routeData.component = layoutFiles['/src/layouts/' + routeData.meta.layout + '/index.vue'];
                } else {
                    routeData.component = layoutFiles['/src/layouts/default/index.vue'];
                }
                routeData.children = [
                    {
                        path: '',
                        component: pageFiles[file.replace('/route.js', '/index.vue')],
                        meta: routeData?.meta || {}
                    }
                ];
            }

            routes.push(routeData);
        }
        return routes;
    };
    `;
};

export const yiteRouter = (options) => {
    let config = {};
    // 虚拟模块定义
    const virtualModuleId = `virtual:yite-router`;
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    return {
        name: 'yite-router',
        enforce: 'pre',
        options(options) {
            // console.log('🚀 ~ file: index.js:7 ~ options ~ options:', options);
        },
        buildStart(options) {
            // console.log('🚀 ~ file: index.js:10 ~ buildStart ~ options:', options);
        },
        configResolved(resolvedConfig) {
            // 存储最终解析的配置
            config = resolvedConfig;
        },
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                return createVirtualModuleCode();
            }
        }
    };
};
