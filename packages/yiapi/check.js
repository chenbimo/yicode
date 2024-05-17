import path from 'node:path';
import fs from 'fs-extra';
import logSymbols from 'log-symbols';
import { isEmpty, isPlainObject, isFunction } from 'lodash-es';

// 协议文件
import { appConfigSchema } from './schema/appConfigSchema.js';

// 配置文件
import { appConfig, appConfigOrigin } from './config/app.js';
import { sysConfig } from './config/sysConfig.js';
import { fnImport, fnIsUnique } from './utils/index.js';
import { ajvValidate } from './utils/fnAjvValidate.js';

// 增加判断，当前目录是否有 yiapi.js 文件，有则正在执行

// 确保关键目录存在
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'apis'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'plugins'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'logs'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'public'));
fs.ensureFileSync(path.resolve(sysConfig.appDir, 'yiapi.js'));
fs.ensureFileSync(path.resolve(sysConfig.appDir, 'config', 'callback.js'));

const { callbackConfig } = await fnImport(path.resolve(sysConfig.appDir, 'config', 'callback.js'), 'callbackConfig', {});

if (isPlainObject(callbackConfig) === false) {
    console.log(`${logSymbols.warning} callback.js 文件必须为一个对象`);
    process.exit(1);
}

if (isFunction(callbackConfig.weixinMessage) === false) {
    console.log(`${logSymbols.warning} callback.js 文件中的 weixinMessage 必须为一个函数`);
    process.exit(1);
}

if (isFunction(callbackConfig.weixinPayNotify) === false) {
    console.log(`${logSymbols.warning} callback.js 文件中的 weixinPayNotify 必须为一个函数`);
    process.exit(1);
}

if (isEmpty(appConfigOrigin) === true) {
    console.log(`${logSymbols.warning} appConfig.js 文件配置为空`);
    process.exit(1);
}

ajvValidate('appConfig.js', appConfigSchema, appConfigOrigin, true);

if (fnIsUnique(Object.values(appConfigOrigin.product)) === false) {
    console.log(`${logSymbols.warning} 产品代号必须唯一`);
    process.exit(1);
}

if (fnIsUnique(appConfigOrigin.payment.map((item) => item.code)) === false) {
    console.log(`${logSymbols.warning} 支付代号必须唯一`);
    process.exit(1);
}

if (appConfig.devPassword === 'dev123456') {
    // 启动前验证
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
