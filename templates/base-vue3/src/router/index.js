import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:yite-layout';

// 创建路由
const router = createRouter({
    extendRoutes: (routes) => setupLayouts(routes),
    history: createWebHashHistory()
});

export { router };
