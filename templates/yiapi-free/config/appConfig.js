export const appConfig = {
    appName: '易接口免费模板',
    appNameEn: 'yiapi-free',
    port: 3000,
    devPassword: '123456',
    database: {
        // 本地数据库
        db: 'test',
        username: 'root',
        password: 'root',
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3306
    },
    redis: {
        password: process.env.NODE_ENV === 'development' ? '' : '123456',
        keyPrefix: 'test#'
    }
};
