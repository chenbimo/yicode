import { cloneDeep as _cloneDeep, merge as _merge, kebabCase as _kebabCase } from 'lodash-es';
/**
 * 生成路由数组
 * @param  {...any} options 参数
 * @returns String
 */
export function yidash_routes_generate(routeFiles, pageFiles, layoutFiles) {
    let routes = [];

    // 以路由文件为基础遍历
    for (let file in routeFiles) {
        // 路由路径
        let routePath = _kebabCase(
            file
                .replace(/\/+/gi, '/')
                .replace('/route.js', '')
                .replace('.', '')
                .replace(/.*\/pages/, '')
                .replace(/\/+/gi, 'oooooo')
        )
            .replace(/oooooo/gi, '/')
            .replace(/-(\d+)/gi, '$1')
            .replace(/-\//gi, '/');
        let mod = routeFiles[file];
        let routeData = mod.default || {};

        // 如果没有设置路由，则自动设置（考虑是否禁止手动设置）

        routeData.path = routePath === '/index' ? '/' : routePath;

        if (routeData.layout !== undefined) {
            // 如果定义了框架属性
            if (routeData.layout !== false) {
                routeData.component = layoutFiles[`/src/layouts/${routeData.layout}/index.vue`];
                // 定义当前页面组件
                routeData.children = _merge(
                    [
                        {
                            path: '',
                            component: pageFiles[file.replace('/route.js', '/index.vue')]
                        }
                    ],
                    _cloneDeep(routeData.children || [])
                );
            } else {
                // 如果框架为false，则当前页面取代框架位置
                routeData.component = pageFiles[file.replace('/route.js', '/index.vue')];
            }
        } else {
            // 如果没有定义框架，则默认每个页面都有框架
            routeData.component = () => import('@/layouts/default/index.vue');
            // 定义当前页面组件
            routeData.children = _merge(
                [
                    {
                        path: '',
                        component: pageFiles[file.replace('/route.js', '/index.vue')]
                    }
                ],
                _cloneDeep(routeData.children || [])
            );
        }

        routes.push(routeData);
    }

    return routes;
}
