export const mysqlConfig = {
    // 开发环境配置
    development: {
        host: '127.0.0.1',
        port: 3306,
        db: 'test',
        username: 'root',
        password: 'root'
    },
    // 生产环境配置
    production: {
        host: '127.0.0.1',
        port: 3306,
        db: 'test',
        username: 'root',
        password: 'root'
    }
}[process.env.NODE_ENV || 'development'];
