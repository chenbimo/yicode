import { resolve } from 'node:path';
import { mergeAndConcat } from 'merge-anything';

import { fnImport, fnCloneAny } from '../utils/index.js';
import { system } from '../system.js';

const { appConfig: importConfig } = await fnImport(resolve(system.appDir, 'config', 'appConfig.js'), 'appConfig', {});

// 克隆一份用户自己的配置文件
const appConfigOrigin = fnCloneAny(importConfig);

const appConfig = mergeAndConcat(
    {
        // 应用名称
        appName: '易接口',
        appNameEn: 'yiapi',
        // 加密盐
        salt: 'yiapi-123456.',
        // 监听端口
        port: 3000,
        // 监听主机
        host: '127.0.0.1',
        // 超级管理员密码
        devPassword: 'dev123456',
        // 日志字段过滤，不打印
        logFilter: ['password', 'file'],
        // 是否进行参数验证
        paramsCheck: false,
        // 是否显示接口文档
        isSwagger: false,
        // 是否开启微信支付
        isWxPay: false,
        // 任何情况下可以访问的路由
        freeApis: [
            //
            '/',
            '/favicon.*',
            '/docs/**',
            '/public/**',
            '/api/tool/tokenCheck',
            '/api/admin/login',
            '/api/weixin/loginCheck',
            '/api/weixin/getConfg',
            '/api/weixin/loginQrcode',
            '/api/weixin/message',
            '/api/weixin/payNotify'
        ],
        // 黑名单接口，不可访问的接口
        blackApis: [],
        // 白名单接口，登录后访问无限制
        whiteApis: [],
        // 黑名单菜单
        blackMenus: [],
        // TODO: 考虑增加 uuid 类型以及不同的 uuid 格式
        // 数据库表主键方案 default（mysql 自带）time（时序 ID）
        tablePrimaryKey: 'default',
        // 数据库配置
        database: {
            db: null,
            username: null,
            password: null,
            host: null,
            dialect: 'mysql',
            port: 3306
        },
        // redis 配置
        redis: {
            host: '127.0.0.1',
            port: 6379,
            username: '',
            password: '',
            db: 0,
            keyPrefix: 'yiapi:'
        },
        // jwt 配置
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
            user: 'demo@qq.com',
            pass: '',
            from_name: '易接口',
            from_email: 'demo@qq.com'
        },
        // 请求速率
        rate: {},
        // 定时器
        cron: [],
        // 扩展表字段
        table: {},
        // 微信配置
        weixin: {},
        // 产品配置
        product: {},
        // 支付配置
        payment: []
    },
    importConfig
);

export { appConfig, appConfigOrigin };
