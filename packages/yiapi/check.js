// 内核模块
import { resolve, basename } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';
// 外部模块
import { ensureDirSync } from 'fs-extra';
import logSymbols from 'log-symbols';
import Ajv from 'ajv';
import localize from 'ajv-i18n';
import { isEmpty, isPlainObject, isFunction } from 'lodash-es';

// 内部模块
import { system } from './system.js';

// 配置文件
import { appConfig } from './config/app.js';
import { callbackConfig } from './config/callback.js';
import { productConfig } from './config/product.js';
import { paymentConfig } from './config/payment.js';
import { jwtConfig } from './config/jwt.js';
// 工具函数
import { toUnique } from './utils/toUnique.js';
import { fnImportCoreConfig } from './utils/fnImportCoreConfig.js';
import { fnImportCoreSchema } from './utils/fnImportCoreSchema.js';

// 判断运行目录下是否有 yiapi.js 文件
if (existsSync(resolve(system.appDir, 'yiapi.js')) === false) {
    console.log(`${logSymbols.warning} 请在 yiapi 项目根目录下运行`);
    process.exit(1);
}

// 检测环境变量
if (['development', 'production'].includes(process.env.NODE_ENV) === false) {
    console.log(`${logSymbols.warning} 请正确设置 NODE_ENV 环境变量`);
    process.exit(1);
}

// 确保关键目录存在
ensureDirSync(resolve(system.appDir, 'apis'));
ensureDirSync(resolve(system.appDir, 'config'));
ensureDirSync(resolve(system.appDir, 'plugins'));
ensureDirSync(resolve(system.appDir, 'logs'));
ensureDirSync(resolve(system.appDir, 'public'));

// 验证所有配置文件
const ajv = new Ajv({
    strict: false,
    allErrors: true
});
const files = readdirSync(resolve(system.yiapiDir, 'config'));
for (let file of files) {
    const pureFileName = basename(file, '.js');
    const configFile = await fnImportCoreConfig(pureFileName, {});
    const configData = configFile[pureFileName + 'Config'];
    if (!configData) {
        console.log('配置文件无效：' + pureFileName);
        process.exit(1);
    }
    const schemaFile = await fnImportCoreSchema(pureFileName, {});
    const schemaData = schemaFile[pureFileName + 'Schema'];
    if (!schemaData) {
        console.log('验证文件无效：' + pureFileName);
        process.exit(1);
    }
    const validResult = ajv.validate(schemaData, configData);
    if (!validResult) {
        localize.zh(ajv.errors);
        console.log(logSymbols.error, '[ ' + file + ' ] ' + ajv.errorsText(ajv.errors, { separator: '\n' }));
        process.exit(1);
    }
}

// 检测回调配置都是函数
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

if (toUnique(Object.values(productConfig)) === false) {
    console.log(`${logSymbols.warning} 产品代号必须唯一`);
    process.exit(1);
}

if (toUnique(paymentConfig.map((item) => item.code)) === false) {
    console.log(`${logSymbols.warning} 支付代号必须唯一`);
    process.exit(1);
}

if (appConfig.devPassword === 'dev123456') {
    // 启动前验证
    console.log(`${logSymbols.warning} 请修改超级管理员密码！！！（位置：appConfig.devPassword）`);
    process.exit(1);
}

// 启动前验证
if (appConfig.md5Salt === 'yiapi-123456.') {
    console.log(`${logSymbols.warning} 请修改默认加密盐值！！！（位置：appConfig.md5Salt`);
    process.exit(1);
}

// jwt密钥验证
if (jwtConfig.secret === 'yiapi') {
    console.log(`${logSymbols.warning} 请修改jwt默认密钥！！！（位置：appConfig.jwt.secret`);
    process.exit(1);
}
