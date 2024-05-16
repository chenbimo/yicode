// 内部模块
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { createServer as net_createServer, Server as net_Server } from 'node:net';
// 外部模块

import fg from 'fast-glob';
import md5 from 'blueimp-md5';
import got from 'got';

import { copy as copyAny } from 'copy-anything';
import logSymbols from 'log-symbols';
import * as color from 'colorette';
import {
    //
    kebabCase as _kebabCase,
    camelCase as _camelCase,
    lowerCase as _lowerCase,
    forOwn as _forOwn,
    omit as _omit,
    isEmpty as _isEmpty,
    startsWith as _startsWith,
    isArray as _isArray,
    concat as _concat,
    mergeWith as _mergeWith,
    merge as _merge,
    random as _random,
    isString as _isString,
    cloneDeep as _cloneDeep,
    isInteger as _isInteger,
    isNumber as _isNumber,
    uniq as _uniq,
    isPlainObject as _isPlainObject
} from 'lodash-es';
// 配置文件
import { appConfig } from '../config/appConfig.js';
import { sysConfig } from '../config/sysConfig.js';
import { schemaField } from '../config/schemaField.js';

const schemaType = ['string', 'integer', 'number', 'array'];

// 自定义对象数组合并策略
export function fnMergeArray(target, source) {
    const result = _mergeWith(
        //
        target,
        source,
        (obj, src) => {
            if (_isArray(obj?.children) && _isArray(src?.children)) {
                obj.children = obj?.children.concat(src?.children);
                return obj;
            }
        }
    );

    return result;
}

// 克隆数据
export function fnCloneAny(data) {
    const result = copyAny(data);
    return result;
}

// 获取接口目录名称
export function getApiDirName(file) {
    // 如果不是插件接口
    const apiDirName = file //
        .replace(/\\+/gi, '/')
        .replace('/_meta.js', '')
        .replace(/.+\/apis/, '');
    return apiDirName;
}

// 获取接口文件名称
export function getApiFileName(file) {
    const apiFileName = file //
        .replace(/\\+/, '/')
        .replace('.js', '')
        .replace(/.+\/apis/, '');
    return apiFileName;
}

// 获取所有接口文件
export function fnAllApiFiles() {
    const coreApiFiles = fg.sync(['./apis/**/*', '!**/_*/**', '!**/_*.js'], { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.yiapiDir });
    const appApiFiles = fg.sync(['./apis/**/*', '!**/_*/**', '!**/_*.js'], { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.appDir });

    const allApiFiles = _concat(coreApiFiles, appApiFiles);

    return allApiFiles;
}

// 获取所有接口文件
export async function fnAllApiMeta() {
    const coreApiMetaFiles = fg.sync(['./apis/**/_meta.js', '!**/_*/**'], {
        onlyFiles: true,
        dot: false,
        absolute: true,
        cwd: sysConfig.yiapiDir
    });
    const appApiMetaFiles = fg.sync(['./apis/**/_meta.js', '!**/_*/**'], { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.appDir });

    const allApiMetaFiles = _concat(coreApiMetaFiles, appApiMetaFiles);

    return allApiMetaFiles;
}

// 获取 file 协议的路径
export function fnFileProtocolPath(_path) {
    if (_startsWith(_path, 'file:')) {
        return _path;
    } else {
        return pathToFileURL(_path);
    }
}

/**
 * require 函数
 * @param {String} filePath 文件路径，以根目录为基准
 * @param {any} defaultValue 任何默认值
 * @param {String} fromType 从哪里加载，值为 core 或 user
 * @returns 返回结果或默认值
 */
export function fnRequire(filePath, defaultValue, fromType = 'core') {
    try {
        const require = createRequire(fnFileProtocolPath(path.resolve(fromType === 'core' ? sysConfig.yiapiDir : sysConfig.appDir, 'yiapi.js')));
        const result = require(filePath);
        return result;
    } catch (err) {
        return defaultValue;
    }
}

// 获取查询字段
export function fnField(tableName, fromType, excludeFields = []) {
    const filePath = `./tables/${tableName}.json`;
    // 如果没有 fields 字段
    if (['core', 'app'].includes(fromType) === false) {
        console.log(`${logSymbols.warning} ${color.blueBright(filePath)} fromType 属性必须为 core,app 二者之一，请检查`);
        process.exit(1);
    }
    // 内置的字段
    const innerFields = [
        //
        'id',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    const tableJson = fnRequire(filePath, {}, fromType);

    // 如果没有 fields 字段
    if (!tableJson?.fields) {
        console.log(`${logSymbols.warning} ${color.blueBright(filePath)} 没有 fields 属性，请检查`);
        process.exit(1);
    }
    let extraFields = {};
    if (fromType === 'core') {
        extraFields = appConfig?.table[`sys_${tableName}`] || {};
    }
    const includeKeys = _omit(_merge(tableJson?.fields || {}, extraFields), excludeFields);
    const allKeys = _uniq(_concat(innerFields, Object.keys(includeKeys)));
    return allKeys;
}
