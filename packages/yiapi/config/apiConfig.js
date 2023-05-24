// 自由接口，不需要鉴权，任意访问
const apiConfig = {
    freeApis: [
        //
        '/',
        '/favicon.ico',
        '/docs/**',
        '/public/**',
        '/api/admin/login',
        '/api/user/tokenCheck'
    ],
    // 黑名单接口，不可访问的接口
    blackApis: [],
    // 白名单接口，登录后访问无限制
    whiteApis: []
};
