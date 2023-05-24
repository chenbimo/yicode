let appConfig = {
    // 应用名称
    appName: '易接口',
    appNameEn: 'yiapi',
    // 加密盐，请重新设置为一个随机值
    salt: '7c35c305-9bca-5e6a-9c7f-c57b05354c98',
    // 监听端口
    port: 3000,
    // 默认开发管理员密码
    devPassword: 'dev123456',
    // 日志字段过滤，不打印
    logFilter: ['password', 'file'],
    // 任何情况下可以访问的路由
    freeApis: [
        //
        '/',
        '/favicon.ico',
        '/docs/**',
        '/public/**',
        '/api/admin/login',
        '/api/user/tokenCheck',
        '/api/upload/local'
    ],
    // 黑名单接口，不可访问的接口
    blackApis: [],
    // 白名单接口，登录后访问无限制
    whiteApis: [],
    // 黑名单菜单
    blackMenus: [],
    // 数据库配置
    database: {
        db: 'test',
        username: 'root',
        password: 'root',
        host: '127.0.0.1',
        port: 3306
    },
    // 缓存配置
    redis: {
        host: '127.0.0.1',
        port: 6379,
        username: '',
        password: process.env.NODE_ENV === 'production' ? '123456' : '',
        // 第一次使用，请修改此值！！！
        keyPrefix: 'test:'
    },
    // jwt配置
    jwt: {
        // jwt密钥，第一次使用，请修改此密钥值！！！
        secret: 'yiapi',
        expiresIn: '7d'
    },
    // 邮件配置
    mail: {
        host: 'smtp.qq.com',
        port: 465,
        pool: true,
        secure: true,
        // qq邮箱
        user: 'demo@qq.com',
        pass: '',
        from: {
            name: '易接口',
            address: 'demo@qq.com'
        }
    }
};

export { appConfig };
