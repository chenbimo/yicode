import { resolve } from 'node:path';
import { mergeAndConcat } from 'merge-anything';
import Ajv from 'ajv';
import localize from 'ajv-i18n';
import logSymbols from 'log-symbols';

import { fnImport } from '../utils/index.js';
import { sysConfig } from './sysConfig.js';
import { schemaField } from './schemaField.js';
import { appConfigSchema } from '../schema/appConfigSchema.js';

const ajv = new Ajv({ strict: false, messages: false });

const validate = ajv.compile(appConfigSchema);

const { appConfig: importConfig } = await fnImport(resolve(sysConfig.appDir, 'config', 'appConfig.js'), 'appConfig', {});

const valid = validate(importConfig);
if (!valid) {
    localize.zh(validate.errors);
    console.log(logSymbols.error, 'appConfig.js 文件 ' + ajv.errorsText(validate.errors, { separator: '\n' }));
    process.exit(1);
}

const appConfig = mergeAndConcat(
    {
        // 应用名称
        appName: '易接口',
        appNameEn: 'yiapi',
        // 加密盐
        salt: 'yiapi-123456.',
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
            from: {
                name: '易接口',
                address: 'demo@qq.com'
            }
        }
    },
    importConfig
);

export { appConfig };
