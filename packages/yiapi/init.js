import path from 'node:path';
import fs from 'fs-extra';
import logSymbols from 'log-symbols';
import Ajv from 'ajv';
import localize from 'ajv-i18n';
import { isEmpty } from 'lodash-es';

// 协议文件
import { appConfigSchema } from './schema/appConfigSchema.js';

// 配置文件
import { appConfig, appConfigOrigin } from './config/appConfig.js';
import { sysConfig } from './config/sysConfig.js';

if (isEmpty(appConfigOrigin) === true) {
    console.log(`${logSymbols.warning} appConfig.js 文件配置为空`);
    process.exit(1);
}

const ajv = new Ajv({ strict: false, messages: false });

const validateAppConfig = ajv.compile(appConfigSchema);

const validResult = validateAppConfig(appConfigOrigin);
if (!validResult) {
    localize.zh(validResult.errors);
    console.log(logSymbols.error, 'appConfig.js 文件 ' + ajv.errorsText(validResult.errors, { separator: '\n' }));
    process.exit();
}

// 启动前验证
if (appConfig.devPassword === 'dev123456') {
    console.log(`${logSymbols.warning} 请修改超级管理员密码！！！（位置：appConfig.devPassword）`);
    process.exit(1);
}

// 启动前验证
if (appConfig.salt === 'yiapi-123456.') {
    console.log(`${logSymbols.warning} 请修改默认加密盐值！！！（位置：appConfig.salt）`);
    process.exit(1);
}

// jwt密钥验证
if (appConfig.jwt.secret === 'yiapi') {
    console.log(`${logSymbols.warning} 请修改jwt默认密钥！！！（位置：appConfig.jwt.secret`);
    process.exit(1);
}

// 确保关键目录存在
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'apis'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'tables'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'plugins'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'logs'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'public'));
fs.ensureFileSync(path.resolve(sysConfig.appDir, 'yiapi.js'));
