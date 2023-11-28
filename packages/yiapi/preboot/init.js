import path from 'node:path';
import fs from 'fs-extra';
import logSymbols from 'log-symbols';

import { appConfig } from '../config/appConfig.js';
import { sysConfig } from '../config/sysConfig.js';

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
