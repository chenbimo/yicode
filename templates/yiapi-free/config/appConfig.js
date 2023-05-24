let appConfig = {
    port: 3000,
    devPassword: '123456',
    database: {
        // 本地数据库
        db: 'test',
        username: 'root',
        password: 'root',
        host: '127.0.0.1',
        port: 3306
    },
    redis: {
        password: process.env.NODE_ENV === 'production' ? '123456' : '',
        keyPrefix: 'test:'
    }
};

export { appConfig };
