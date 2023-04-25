let routeFiles = import.meta.glob('@/pages/**/route.js', { eager: true });
let pageFiles = import.meta.glob('@/pages/**/index.vue');
let layoutFiles = import.meta.glob('@/layouts/**/index.vue');

// 创建路由
const router = createRouter({
    history: createWebHashHistory(),
    routes: yidash_routes_generate(routeFiles, pageFiles, layoutFiles)
});

export { router };
