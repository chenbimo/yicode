import { resolve } from 'node:path';
import { mergeAndConcat } from 'merge-anything';
import Ajv from 'ajv';
import localize from 'ajv-i18n';
import logSymbols from 'log-symbols';

import { fnImport } from '../utils/index.js';
import { sysConfig } from './sysConfig.js';
import { schemaField } from './schemaField.js';
import { appConfigSchema } from '../schema/appConfigSchema.js';

let ajv = new Ajv({ strict: false, messages: false });

let validate = ajv.compile(appConfigSchema);
let { appConfig: importConfig } = await fnImport(resolve(sysConfig.appDir, 'appConfig.js'), 'appConfig', {});

let valid = validate(importConfig);
if (!valid) {
    localize.zh(validate.errors);
    console.log(logSymbols.error, 'appConfig.js 文件 ' + ajv.errorsText(validate.errors, { separator: '\n' }));
    process.exit();
}

let appConfig = mergeAndConcat(
    {
        // 应用名称
        appName: '易接口',
        appNameEn: 'yiapi',
        // 加密盐
        salt: 'yiapi-123456.',
        // 监听端口
        port: 3000,
        // 超级管理员密码
        devPassword: 'dev123456',
        // 日志字段过滤，不打印
        logFilter: ['password', 'file'],
        // 是否进行参数验证
        paramsCheck: false,
        // 是否显示swagger文档
        isSwagger: false,
        // 任何情况下可以访问的路由
        freeApis: [
            //
            '/',
            '/favicon.*',
            '/docs/**',
            '/public/**',
            '/api/admin/login',
            '/api/tool/tokenCheck'
        ],
        // 黑名单接口，不可访问的接口
        blackApis: [],
        // 白名单接口，登录后访问无限制
        whiteApis: [],
        // 黑名单菜单
        blackMenus: [],
        // TODO: 考虑增加 uuid 类型以及不同的 uuid 格式
        // 数据库表主键方案 default（mysql自带）time（时序ID ）
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
        // redis配置
        redis: {
            host: '127.0.0.1',
            port: 6379,
            username: '',
            password: '',
            db: 0,
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
        // 自定义配置
        custom: {}
    },
    importConfig
);

export { appConfig };
