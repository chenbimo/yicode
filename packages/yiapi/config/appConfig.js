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
        // 自由接口，不需要鉴权，任意访问
        freeApis: [
            //
            '/',
            '/favicon.ico',
            '/docs',
            '/docs/**',
            '/public/**',
            '/api/admin/login',
            '/api/user/login',
            '/api/user/register',
            '/api/user/tokenCheck'
        ],
        // 黑名单接口，不可访问的接口
        blackApis: [],
        // 白名单接口，登录后访问无限制
        whiteApis: [
            //
        ],
        // 缓存映射
        cacheData: {
            role: 'cacheData:role',
            tree: 'cacheData:tree',
            apiNames: 'cacheData:apiNames',
            apiWhiteLists: 'cacheData:apiWhiteLists',
            api: 'cacheData:api',
            menu: 'cacheData:menu',
            weixinAccessToken: 'cacheData:weixinAccessToken'
        },
        // http状态码
        httpCode: {
            SUCCESS: { symbol: 'SUCCESS', code: 0, msg: '操作成功' },
            INSERT_SUCCESS: { symbol: 'INSERT_SUCCESS', code: 0, msg: '添加成功' },
            SELECT_SUCCESS: { symbol: 'SELECT_SUCCESS', code: 0, msg: '查询成功' },
            UPDATE_SUCCESS: { symbol: 'UPDATE_SUCCESS', code: 0, msg: '更新成功' },
            DELETE_SUCCESS: { symbol: 'DELETE_SUCCESS', code: 0, msg: '删除成功' },
            FAIL: { symbol: 'FAIL', code: 1, msg: '操作失败' },
            INSERT_FAIL: { symbol: 'INSERT_FAIL', code: 1, msg: '添加失败' },
            SELECT_FAIL: { symbol: 'SELECT_FAIL', code: 1, msg: '查询失败' },
            UPDATE_FAIL: { symbol: 'UPDATE_FAIL', code: 1, msg: '更新失败' },
            DELETE_FAIL: { symbol: 'DELETE_FAIL', code: 1, msg: '删除失败' },
            INFO: { symbol: 'INFO', code: 11, msg: '提示' },
            WARN: { symbol: 'WARN', code: 12, msg: '警告' },
            ERROR: { symbol: 'ERROR', code: 13, msg: '错误' },
            NOT_LOGIN: { symbol: 'NOT_LOGIN', code: 14, msg: '未登录' },
            API_DISABLED: { symbol: 'API_DISABLED', code: 15, msg: '接口已禁用' },
            NO_FILE: { symbol: 'NO_FILE', code: 17, msg: '文件不存在' },
            NO_API: { symbol: 'NO_API', code: 18, msg: '接口不存在' }
        },
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
