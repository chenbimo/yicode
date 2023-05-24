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
        // 监听主机
        host: '127.0.0.1',
        // 默认开发管理员密码
        devPassword: 'dev123456',
        // 接口超时 3 分钟
        apiTimeout: 3 * 60 * 1000,
        // 请求参数日志过滤字段
        reqParamsFilter: ['password', 'file'],
        // 返回参数日志过滤字段
        resParamsFilter: ['password', 'file'],
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
        // 跨域配置
        cros: {
            methods: ['GET', 'OPTIONS', 'POST'],
            allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'token'],
            exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization', 'authorization', 'token'],
            preflightContinue: false,
            strictPreflight: false,
            preflight: true,
            optionsSuccessStatus: 204,
            credentials: false
        },
        // 数据库配置
        database: {
            db: null,
            username: null,
            password: null,
            host: null,
            dialect: 'mysql',
            port: 3306
        },
        // jwt配置
        jwt: {
            secret: 'yiapi',
            expiresIn: '7d',
            algorithm: 'HS256'
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
        },
        // 消息队列
        mq: {
            // test: (job) => {
            //     console.log('🚀 ~ file: mq.js ~ line 3 ~ job', job.data);
            //     return Promise.resolve();
            // },
            // order: (job) => {
            //     console.log('🚀 ~ file: mq.js ~ line 4 ~ job', job.data);
            //     return Promise.resolve();
            // }
        },
        // redis缓存配置
        redis: {
            host: '127.0.0.1',
            port: 6379,
            username: null,
            password: null,
            keyPrefix: 'yiapi:'
        },
        weixin: {
            appId: '',
            appSecret: ''
        },

        blackMenus: []
    },
    importConfig
);

export { appConfig };
