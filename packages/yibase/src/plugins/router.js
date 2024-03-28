import { yiteRoutes } from 'virtual:yite-router';

// 创建路由
const $Router = createRouter({
    routes: yiteRoutes(),
    history: createWebHashHistory()
});

export { $Router };
