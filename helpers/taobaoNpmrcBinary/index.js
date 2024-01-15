#!/usr/bin/env node
import url from 'node:url';
import { join } from 'node:path';
import { env, platform } from 'node:process';
import { readFileSync, writeFileSync } from 'node:fs';

// 配置处理包
import { parse as ini_parse, stringify as ini_stringify } from 'ini';
import { ensureFileSync } from 'fs-extra/esm';
import logSymbols from 'log-symbols';

// NPM 配置地址
const npmrc = join(env[platform === 'win32' ? 'USERPROFILE' : 'HOME'], '.npmrc');

// 镜像地址
const taobaoMirror = 'https://npmmirror.com/mirrors/';

// 包映射
const packageMap = {
    SHARP_BINARY_HOST: `${taobaoMirror}sharp`,
    SHARP_LIBVIPS_BINARY_HOST: `${taobaoMirror}sharp-libvips`,
    CHROMEDRIVER_CDNURL: `${taobaoMirror}chromedriver`
};

// 获取当前npmrc配置
const mainFun = () => {
    ensureFileSync(npmrc);
    const fileData = readFileSync(npmrc, 'utf-8');
    const fileConfig = ini_parse(fileData);
    const fileKeys = Object.keys(fileConfig).map((name) => name.toUpperCase());
    let newFileConfig = {};
    for (let key in fileConfig) {
        let keyUpper = key.toUpperCase();
        if (packageMap[keyUpper]) {
            newFileConfig[keyUpper] = packageMap[keyUpper];
        } else {
            newFileConfig[key] = fileConfig[key];
        }
    }
    writeFileSync(npmrc, ini_stringify(newFileConfig));
    console.log(`${logSymbols.success} NPM二进制下载链接设置成功`);
};

mainFun();
