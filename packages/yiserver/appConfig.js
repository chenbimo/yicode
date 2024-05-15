import { tableConfig } from './config/table.js';
import { cronConfig } from './config/cron.js';
import { menuConfig } from './config/menu.js';
import { mysqlConfig } from './config/mysql.js';
import { redisConfig } from './config/redis.js';
import { productConfig } from './config/product.js';
import { paymentConfig } from './config/payment.js';
import { weixinConfig } from './config/weixin.js';

// 默认配置
const appConfig = {
    // 应用名称
    appName: '易接口',
    appNameEn: 'yiapi',
    // 加密盐，请重新设置为一个随机值
    salt: 'yiapi-123456.0',
    // 监听端口
    port: 3000,
    // 监听主机
    host: '127.0.0.1',
    // 超级管理员密码
    devPassword: 'dev1234560',
    // 是否验证参数
    paramsCheck: false,
    // 日志字段过滤，不打印
    logFilter: ['password', 'file'],
    // 是否开启接口文档
    isSwagger: false,
    // 是否开启支付功能
    isWxPay: false,
    // 任何情况下可以访问的路由
    freeApis: [
        //
        '/',
        '/favicon.ico',
        '/docs/**',
        '/public/**',
        '/api/admin/login',
        '/api/tool/tokenCheck',
        '/api/upload/local',
        '/api/tool/sendMail',
        '/api/news/insert'
    ],
    // 黑名单接口，不可访问的接口
    blackApis: [],
    // 白名单接口，登录后访问无限制
    whiteApis: [],
    // 黑名单菜单
    blackMenus: [],
    // 数据库表主键方案
    tablePrimaryKey: 'default',
    // 数据库配置
    database: {
        host: mysqlConfig.host,
        port: mysqlConfig.port,
        db: mysqlConfig.db,
        username: mysqlConfig.username,
        password: mysqlConfig.password
    },
    // 缓存配置
    redis: {
        host: redisConfig.host,
        port: redisConfig.port,
        username: redisConfig.username,
        password: redisConfig.password,
        db: redisConfig.db,
        keyPrefix: redisConfig.keyPrefix
    },
    // jwt 配置
    jwt: {
        // jwt 密钥，第一次使用，请修改此密钥值！！！
        secret: 'yiapi0',
        expiresIn: '7d'
    },
    // 邮件配置
    mail: {
        host: 'smtp.qq.com',
        port: 465,
        pool: true,
        secure: true,
        // qq 邮箱
        user: 'demo@qq.com',
        pass: '',
        from_name: '易接口',
        from_email: 'demo@qq.com'
    },
    // 上传目录
    upload: {
        dir: process.env.NODE_ENV === 'production' ? './public/static' : './public/static'
    },
    // 请求速率
    rate: {},
    // 定时器
    cron: cronConfig,
    // 扩展表
    table: tableConfig,
    // 菜单配置
    menu: menuConfig,
    // 产品配置
    product: productConfig,
    // 支付配置
    payment: paymentConfig,
    // 微信配置
    weixin: weixinConfig
};

export { appConfig };
