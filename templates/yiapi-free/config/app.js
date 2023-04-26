const appConfig = {
    // 应用名称
    appName: '易接口免费模板',
    appNameEn: 'yiapi-free',
    port: 3000,
    devPassword: '123456',
    md5Key: 'test-123456.',
    salt: '0860be89-171e-5436-b527-71681fbc2c2b',
    // 禁用参数检查
    authCheck: false,
    // 自由接口，无任何限制
    freeApis: [
        //
        '/',
        '/docs/**',
        '/api/user/login',
        '/api/user/register'
    ],
    whiteLists: [
        //
    ]
};

export { appConfig };
