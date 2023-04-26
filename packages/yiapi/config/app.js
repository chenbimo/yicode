import path from 'node:path';
import { mergeAndConcat } from 'merge-anything';

import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'app.js'));
let { appConfig: importConfig } = await fnImport(configPath, 'appConfig', {});

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
        devPassword: 'dev123456!@#',
        // 接口超时 3 分钟
        apiTimeout: 3 * 60 * 1000,
        // 请求参数日志过滤字段
        reqParamsFilter: ['password'],
        // 返回参数日志过滤字段
        resParamsFilter: ['password'],
        // 自由通行的接口，不需要鉴权
        freeApis: ['/', '/favicon.ico', '/docs', '/docs/**', '/public/**'],
        // 白名单接口，需要鉴权
        whiteApis: [
            //
            '/api/admin/login',
            '/api/user/login',
            '/api/user/register'
        ]
    },
    importConfig
);

export { appConfig };
