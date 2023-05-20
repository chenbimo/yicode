import { createRouter, createWebHashHistory } from 'vue-router';
import { yiteRoutes } from 'virtual:yite-router';

// 创建路由
const router = createRouter({
    routes: yiteRoutes(),
    history: createWebHashHistory()
});

export { router };
