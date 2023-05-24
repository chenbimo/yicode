import { resolve } from 'node:path';
import { mergeAndConcat } from 'merge-anything';

import { fnImport } from '../utils/index.js';
import { sysConfig } from './sysConfig.js';

const { appConfig: importConfig } = await fnImport(resolve(sysConfig.appDir, 'config', 'appConfig.js'), 'appConfig', {});

const appConfig = mergeAndConcat(
    {
        // 应用名称
        appName: '易接口',
        appNameEn: 'yiapi',
        // 加密盐
        salt: 'yiapi-123456.',
        // 过期时间
        expires: '7d',
        // 监听端口
        port: 3000,
        // 默认开发管理员密码
        devPassword: 'dev123456',
        // 接口超时 3 分钟
        apiTimeout: 3 * 60 * 1000,
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
            '/api/user/tokenCheck'
        ],
        // 黑名单接口，不可访问的接口
        blackApis: [],
        // 白名单接口，登录后访问无限制
        whiteApis: [],
        // 黑名单菜单
        blackMenus: [],
        // 数据库配置
        database: {
            db: null,
            username: null,
            password: null,
            host: null,
            dialect: 'mysql',
            port: 3306
        },
        // redis缓存配置
        redis: {
            host: '127.0.0.1',
            port: 6379,
            username: null,
            password: null,
            keyPrefix: 'yiapi:'
        },
        // jwt配置
        jwt: {
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
    },
    importConfig
);

export { appConfig };
