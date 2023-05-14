import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router/auto';
import { setupLayouts } from 'virtual:generated-layouts';

// 创建路由
const router = createRouter({
    extendRoutes: (routes) => setupLayouts(routes),
    history: createWebHashHistory()
});

export { router };
