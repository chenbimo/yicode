// 内部模块
import crypto from 'node:crypto';
import path from 'node:path';
import url from 'node:url';
import { createRequire } from 'node:module';
import { createServer as net_createServer, Server as net_Server } from 'node:net';
// 外部模块

import fg from 'fast-glob';
import md5 from 'blueimp-md5';
import got from 'got';
import { customAlphabet } from 'nanoid';
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

// 自定义初始化字符
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 26);
const schemaType = ['string', 'integer', 'number', 'array'];

// 转换成中划线
export function fnKebabCase(value, delimiter = '/') {
    if (value === undefined || value === null || value === '') return value;
    const data = value
        .split(delimiter)
        .map((v) => _kebabCase(v))
        .join(delimiter);
    return data;
}

// 延迟函数
export const fnDelay = (wait) => {
    return new Promise((resolve) => {
        setTimeout(resolve, wait);
    });
};

// 是否有重复值
export const fnIsUnique = (array) => {
    return new Set(array).size === array.length;
};

// 端口是否打开
export const fnIsPortOpen = (port) => {
    return new Promise((resolve, reject) => {
        const server = net_createServer();

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            } else {
                reject(err);
            }
        });
        server.on('listening', (data) => {
            server.close(() => {
                resolve(true);
            });
        });

        server.listen(port);
    });
};

// 转换成小驼峰
export function fnCamelCase(value, delimiter = '/') {
    if (value === undefined || value === null || value === '') return value;
    const data = value
        .split(delimiter)
        .map((v) => _camelCase(v))
        .join(delimiter);
    return data;
}

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

// 信用卡验证算法
export const fnLuhn = (str) => {
    const ord = 48;
    const textEncoder = new TextEncoder();
    const bytes = textEncoder.encode(String(str));
    let ptr = bytes.length - 1;
    let sum = 0;
    let mul = 2;
    while (ptr >= 0) {
        let val = bytes[ptr--] - ord;
        val *= mul;
        sum += ((val % 10) + val / 10) | 0;
        mul = 1 + (mul % 2);
    }
    return (10 - (sum % 10)) % 10;
};

// 创建顺序自增唯一 ID
export function fnIncrUID() {
    const timestamp = Math.floor(Date.now() / 1000);
    const random = crypto.randomInt(100000, 999999);
    return `${timestamp}${random}`;
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

// 获取文件名（不包括扩展名）
export function fnApiInfo(metaUrl) {
    const _filename = fnFilename(metaUrl);
    const _dirname = fnDirname(metaUrl);

    const pureFileName = path.basename(_filename, '.js');

    const parentDirName = _dirname.replace(/\\+/gi, '/').replace(/.+\/apis/, '');

    const metaFile = path.dirname(metaUrl) + '/_meta.js';

    const apiHash = {
        pureFileName: pureFileName,
        parentDirName: parentDirName,
        apiPath: [parentDirName, pureFileName].join('/')
    };

    return apiHash;
}

// 获取请求的接口路径
export function fnApiPath(metaUrl) {
    const apiPath = '/' + path.relative(path.resolve('./apis'), url.fileURLToPath(metaUrl)).replace('.js', '').replace(/\\+/, '/');
    return apiPath;
}

// 清理对象的空数据
export function fnClearEmptyData(obj, expludeFields = ['id']) {
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined) {
            newObj[key] = value;
        }
    });
    return _omit(newObj, expludeFields);
}

// 减少日志过长的内容
export function fnClearLogData(obj, expludeFields = []) {
    const objNew = _cloneDeep(_omit(obj, expludeFields));
    // fnObjTraverse(objNew, {
    //     processValue: (key, value, level, path, isObjectRoot, isArrayElement, cbSetValue) => {
    //         if (_isString(value)) {
    //             cbSetValue(value.slice(0, 100));
    //         }
    //     }
    // });
    return objNew;
}

// 数据库添加数据
export function fnDbInsertData(obj) {
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined) {
            newObj[key] = value;
        }
    });
    newObj.created_at = fnTimestamp();
    newObj.updated_at = fnTimestamp();
    if (appConfig.tablePrimaryKey !== 'default') {
        // 当主键为 time 模式时，更改 id 字段的值
        if (appConfig.tablePrimaryKey === 'time') {
            newObj.id = fnIncrUID();
        }
    }
    return newObj;
}

// 数据库更新数据
export function fnDbUpdateData(obj) {
    const excludeFields = ['id', 'created_at'];
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined && !excludeFields.includes(key)) {
            newObj[key] = value;
        }
    });
    newObj.updated_at = fnTimestamp();
    return newObj;
}

// 补全空对象
export function fnRepairEmptyData(obj, expludeFields = ['id']) {
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined) {
            newObj[key] = value;
        } else {
            newObj[key] = '';
        }
    });
    return _omit(newObj, expludeFields);
}

// 随机 hash 值
export function fnUUID(size = 26) {
    return nanoid(size);
}

// 加盐的 md5 值
export function fnSaltMD5(value) {
    return md5(value, appConfig.salt);
}

// 单纯的 md5 值
export function fnPureMD5(value) {
    return md5(value);
}

// 获取毫秒级时间戳
export function fnTimestamp() {
    return Date.now();
}

// 随机 6 位数
export function fnRandom6Number() {
    return _random(100000, 999999);
}

export function fnRelativePath(from, to) {
    const _relative = path.relative(from, to);
    const _covertPath = _relative.replace(/\\+/g, '/');

    // 如果第一个不是（.），则自动拼接点
    if (_covertPath.indexOf('.') !== 0) {
        _covertPath = './' + _covertPath;
    }
    return _covertPath;
}

export function fnFilename(metaUrl) {
    return url.fileURLToPath(metaUrl);
}

export function fnDirname(metaUrl) {
    const filename = url.fileURLToPath(metaUrl);
    return path.dirname(filename);
}

/**
 * 返回路由地址的路径段
 * @param {String} url 请求路径（不带 host）
 * @returns {String} 返回路径字段
 */
export function fnRouterPath(url) {
    const urls = new URL(url, 'http://127.0.0.1');
    const apiPath = urls.pathname;
    return apiPath;
}

// 参数签名
export function fnApiParamsSign(params) {
    let fieldsArray = [];
    _forOwn(params, (value, key) => {
        if (value !== undefined && value !== null) {
            fieldsArray.push(`${key}=${value}`);
        }
    });

    const fieldsSort = fieldsArray.sort().join('&');

    const fieldsMd5 = md5(fieldsSort);
    return { sign: fieldsMd5, sort: fieldsSort };
}

/**
 * 检查传参有效性
 */
export function fnApiParamsCheck(req) {
    return new Promise((resolve, reject) => {
        const fields = req.body;

        const fieldsParams = _omit(fields, ['sign']);

        if (_isEmpty(fieldsParams)) {
            return resolve({ code: 0, msg: '接口未带参数' });
        }

        if (!fieldsParams.t) {
            return reject({ code: 1, msg: '接口请求时间无效' });
        }

        const diffTime = Date.now() - Number(fieldsParams.t);
        if (diffTime > 3 * 60 * 1000) {
            return reject({ code: 1, msg: '接口请求时间已过期' });
        }

        const paramsValid = fnApiParamsSign(fieldsParams);

        if (paramsValid.sign !== fields.sign) {
            return reject({ code: 1, msg: '接口请求参数校验失败', other: paramsValid });
        }

        return resolve({ code: 0, msg: '接口参数正常' });
    });
}

/**
 * 可控导入
 * @param {String} path 导入路径
 * @param {String} name 导入失败时的名称
 * @param {Any} default 默认值
 */
export async function fnImport(path, name, defaultValue, options = {}) {
    try {
        let dd = fnFileProtocolPath(path);
        const data = await import(fnFileProtocolPath(path), options);
        return fnCloneAny(data);
    } catch (err) {
        console.log('🚀 ~ fnImport ~ err:', err);
        return fnCloneAny({
            [name]: defaultValue
        });
    }
}

// 设置路由函数
export const fnRoute = (metaUrl, fastify, options) => {
    const apiInfo = fnApiInfo(metaUrl);
    const method = _lowerCase(options.method || 'post');
    if (!options.apiName) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口没有 apiName 属性，请检查`);
        process.exit(1);
    }
    if (!options.schemaRequest) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口没有 schemaRequest 属性，请检查`);
        process.exit(1);
    }
    if (!options.apiHandler) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口没有 apiHandler 属性，请检查`);
        process.exit(1);
    }
    if (!['get', 'post'].includes(method)) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口方法只能为 get 或 post 之一，请检查`);
        process.exit(1);
    }

    options.schemaRequest.title = options.apiName;

    let routeParams = {
        method: method,
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: options.apiName,
            tags: [apiInfo.parentDirName],
            response: options.schemaResponse || {}
        },
        handler: options.apiHandler
    };

    if (routeParams.method === 'get') {
        routeParams.schema.query = options.schemaRequest;
    } else {
        routeParams.schema.body = options.schemaRequest;
    }
    fastify.route(routeParams);
};

// 获取 file 协议的路径
export function fnFileProtocolPath(_path) {
    if (_startsWith(_path, 'file:')) {
        return _path;
    } else {
        return 'file:///' + _path.replace(/\\+/gi, '/');
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

// rsa-sha256 加密
export function fnRsaSha256(data, privateKey) {
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(data);
    const signature = sign.sign(privateKey, 'base64');
    return signature;
}

// 接口元数据函数
export const fnMeta = (metaUrl, data) => {
    const apiInfo = fnApiInfo(metaUrl);
    if (_isPlainObject(data) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 元数据必须为对象类型，请检查`);
        process.exit(1);
    }
    if (!data._name) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 元数据没有 _name 属性，请检查`);
        process.exit(1);
    }
    if (_isString(data._name) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 元数据的 _name 属性必须为字符串，请检查`);
        process.exit(1);
    }

    _forOwn(_omit(data, ['_name']), (item, key) => {
        // 判断是否有标题
        if (!item.title) {
            console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} ${key} 参数缺少 title 名称，请检查`);
            process.exit(1);
        }

        // 判断参数类型
        if (schemaType.includes(item.type) === false) {
            console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} ${key} 参数只能为 ${schemaType.join(',')} 其中之一`);
            process.exit(1);
        }
    });

    const mergeData = _merge(data, {
        id: fnSchema(schemaField.id, '主键ID'),
        page: fnSchema(schemaField.page, '第几页'),
        limit: fnSchema(schemaField.limit, '每页多少条')
    });

    return mergeData;
};

/**
 * 数字参数协议
 * @param {String} field 预置字段
 * @param {String} title 参数名称
 * @param {String} type 参数类型
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @param {Number} defaultValue 默认值
 * @param {Array} enumValue 枚举值
 * @param {Number|Integer|String} extraValue 扩展值
 * @param {Boolean} uniqueItems 数组类型时，值是否唯一
 * @returns Object
 */
export const fnSchema = (field, title, type, min, max, defaultValue, enumValue, extraValue, uniqueItems) => {
    try {
        // 获取已经存在的公共配置参数
        let fieldData = fnCloneAny(field || {});

        // 字段协议必须填写名称
        if (!_isEmpty(title)) fieldData.title = title;
        if (!_isEmpty(type)) fieldData.type = type;

        // 如果有枚举参数，则忽略最大，最小参数
        if (_isArray(enumValue)) {
            fieldData.enum = enumValue;
        } else {
            if (type === 'number') {
                // 最大最小值覆盖
                if (_isNumber(min)) fieldData.minimum = min;
                if (_isNumber(max)) fieldData.maximum = max;

                // 倍数值覆盖
                if (_isNumber(multipleOf)) fieldData.multipleOf = extraValue;
            }

            if (type === 'integer') {
                // 最大最小值覆盖
                if (_isInteger(min)) fieldData.minimum = min;
                if (_isInteger(max)) fieldData.maximum = max;
                // 倍数值覆盖
                if (_isNumber(extraValue)) fieldData.multipleOf = extraValue;
            }

            if (type === 'string') {
                // 最大最小值覆盖
                if (_isInteger(min)) fieldData.minLength = min;
                if (_isInteger(max)) fieldData.maxLength = max;
                // 字符模式
                if (_isString(extraValue)) fieldData.pattern = extraValue;
            }

            if (type === 'array') {
                // 最大最小值覆盖
                if (_isInteger(min)) fieldData.minItems = min;
                if (_isInteger(max)) fieldData.maxItems = max;
                // 字符模式
                if (_isString(extraValue)) {
                    if (['number', 'integer', 'string'].includes(extraValue) === true) {
                        fieldData.items = {
                            type: extraValue
                        };
                    } else {
                        fieldData.items = extraValue.split('|').map((value) => {
                            if (['number', 'integer', 'string'].includes(value) === true) {
                                return {
                                    type: value
                                };
                            } else {
                                return {
                                    enum: value.split(',').filter((v) => v)
                                };
                            }
                        });
                    }
                }
            }
        }

        // 默认值覆盖
        if (_isNumber(defaultValue)) fieldData.default = defaultValue;

        return fieldData;
    } catch (err) {
        throw new Error(err);
    }
};

// 获取参数按小写排序拼接
export const fnParamsRaw = (args) => {
    const keys = Object.keys(args).sort();
    const newArgs = keys
        .map((key) => {
            return `${key.toLowerCase()}=${args[key]}`;
        })
        .join('&');

    return newArgs;
};

// 创建哈希算法
export const fnHashSign = (algorithm, content) => {
    const hash = crypto.createHash(algorithm);
    hash.update(content);
    return hash.digest('hex');
};
