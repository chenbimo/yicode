import path from 'node:path';
import url from 'node:url';
import fg from 'fast-glob';
import md5 from 'blueimp-md5';
import got from 'got';
import { customAlphabet } from 'nanoid';
import { copy as copyAny } from 'copy-anything';
import { jsonPack, jsonUnpack, jsonCrush, jsonUncrush } from '@yicode/yijson-mini';
import {
    //
    kebabCase as _kebabCase,
    camelCase as _camelCase,
    forOwn as _forOwn,
    omit as _omit,
    isEmpty as _isEmpty,
    startsWith as _startsWith,
    isArray as _isArray,
    concat as _concat,
    mergeWith as _mergeWith,
    random as _random,
    isString as _isString
} from 'lodash-es';

import { appConfig } from '../config/appConfig.js';
import { sysConfig } from '../config/sysConfig.js';

// 自定义初始化字符
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 26);

// pack 加密json数据
export function fnJsonPack(data) {
    return jsonPack(data);
}

// unpack 解密json数据
export function fnJsonUnpack(data) {
    return jsonUnpack(data);
}

// crush 加密json数据
export function fnJsonCrush(data) {
    return jsonCrush(data);
}

// uncrush 解密json数据
export function fnJsonUncrush(data) {
    return jsonUncrush(data);
}

// 压缩为一行json
export function fnInlineJson(json) {
    let tokenizer = /"|(\/\*)|(\*\/)|(\/\/)|\n|\r|\[|]/g,
        in_string = false,
        in_multiline_comment = false,
        in_singleline_comment = false,
        tmp,
        tmp2,
        new_str = [],
        ns = 0,
        from = 0,
        lc,
        rc,
        prevFrom;

    tokenizer.lastIndex = 0;

    while ((tmp = tokenizer.exec(json))) {
        lc = RegExp.leftContext;
        rc = RegExp.rightContext;
        if (!in_multiline_comment && !in_singleline_comment) {
            tmp2 = lc.substring(from);
            if (!in_string) {
                tmp2 = tmp2.replace(/(\n|\r|\s)*/g, '');
            }
            new_str[ns++] = tmp2;
        }
        prevFrom = from;
        from = tokenizer.lastIndex;

        // found a " character, and we're not currently in
        // a comment? check for previous `\` escaping immediately
        // leftward adjacent to this match
        if (tmp[0] === '"' && !in_multiline_comment && !in_singleline_comment) {
            // limit left-context matching to only go back
            // to the position of the last token match
            //
            // see: https://github.com/getify/JSON.minify/issues/64
            lc.lastIndex = prevFrom;

            // perform leftward adjacent escaping match
            tmp2 = lc.match(/(\\)*$/);
            // start of string with ", or unescaped " character found to end string?
            if (!in_string || !tmp2 || tmp2[0].length % 2 === 0) {
                in_string = !in_string;
            }
            from--; // include " character in next catch
            rc = json.substring(from);
        } else if (tmp[0] === '/*' && !in_string && !in_multiline_comment && !in_singleline_comment) {
            in_multiline_comment = true;
        } else if (tmp[0] === '*/' && !in_string && in_multiline_comment && !in_singleline_comment) {
            in_multiline_comment = false;
        } else if (tmp[0] === '//' && !in_string && !in_multiline_comment && !in_singleline_comment) {
            in_singleline_comment = true;
        } else if ((tmp[0] === '\n' || tmp[0] === '\r') && !in_string && !in_multiline_comment && in_singleline_comment) {
            in_singleline_comment = false;
        } else if (!in_multiline_comment && !in_singleline_comment && !/\n|\r|\s/.test(tmp[0])) {
            new_str[ns++] = tmp[0];
        }
    }
    new_str[ns++] = rc;
    return new_str.join('');
}

// 安全字符串化
export function fnStringify(data) {
    return JSON.stringify(fnInlineJson(data));
}

// 转换成中划线
export function fnKebabCase(value, delimiter = '/') {
    if (value === undefined || value === null || value === '') return value;
    let data = value
        .split(delimiter)
        .map((v) => _kebabCase(v))
        .join(delimiter);
    return data;
}

// 转换成小驼峰
export function fnCamelCase(value, delimiter = '/') {
    if (value === undefined || value === null || value === '') return value;
    let data = value
        .split(delimiter)
        .map((v) => _camelCase(v))
        .join(delimiter);
    return data;
}

// 自定义对象数组合并策略
export function fnMergeArray(target, source) {
    let result = _mergeWith(
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
    let result = copyAny(data);
    return result;
}

// 获取接口目录名称
export function getApiDirName(file) {
    let apiDirName = '';
    if (file.indexOf('addons') === -1) {
        // 如果不是插件接口
        apiDirName = file //
            .replace(/\\+/gi, '/')
            .replace('/_meta.js', '')
            .replace(/.+\/apis/, '');
    } else {
        // 如果是插件接口
        apiDirName = file //
            .replace(/\\+/gi, '/')
            .replace('/_meta.js', '')
            .replace(/.+\/addons/, '')
            .replace('/apis', '');
    }
    return apiDirName;
}

// 获取接口文件名称
export function getApiFileName(file) {
    let apiFileName = '';
    if (file.indexOf('addons') === -1) {
        apiFileName = file //
            .replace(/\\+/, '/')
            .replace('.js', '')
            .replace(/.+\/apis/, '');
    } else {
        apiFileName = file //
            .replace(/\\+/, '/')
            .replace('.js', '')
            .replace(/.+\/addons/, '')
            .replace('/apis', '');
    }
    return apiFileName;
}

// 获取所有接口文件
export function fnAllApiFiles() {
    let coreApiFiles = fg.sync(['./apis/**/*', '!**/_*.js'], { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.yiapiDir });
    let appApiFiles = fg.sync(['./apis/**/*', '!**/_*.js'], { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.appDir });
    let thirdApiFiles = fg.sync(['./addons/*/apis/*', '!**/_*.js'], { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.appDir });

    let allApiFiles = _concat(coreApiFiles, appApiFiles, thirdApiFiles);

    return allApiFiles;
}

// 获取所有接口文件
export async function fnAllApiMeta() {
    let coreApiMetaFiles = fg.sync('./apis/**/_meta.js', { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.yiapiDir });
    let appApiMetaFiles = fg.sync('./apis/**/_meta.js', { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.appDir });
    let thirdApiMetaFiles = fg.sync('./addons/*/apis/_meta.js', { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.appDir });

    let allApiMetaFiles = _concat(coreApiMetaFiles, appApiMetaFiles, thirdApiMetaFiles);

    return allApiMetaFiles;
}

// 获取文件名（不包括扩展名）
export async function fnApiInfo(metaUrl) {
    let _filename = fnFilename(metaUrl);
    let _dirname = fnDirname(metaUrl);

    const pureFileName = path.basename(_filename, '.js');

    let parentDirName = '';
    if (_dirname.indexOf('addons') === -1) {
        parentDirName = _dirname.replace(/\\+/gi, '/').replace(/.+\/apis/, '');
    } else {
        parentDirName = _dirname
            .replace(/\\+/gi, '/')
            .replace(/.+\/addons/, '')
            .replace('/apis', '');
    }

    let metaFile = path.dirname(metaUrl) + '/_meta.js';

    let { metaConfig } = await fnImport(metaFile, {});

    let apiHash = {
        pureFileName: pureFileName,
        parentDirName: metaConfig?.dir ? metaConfig?.dir : parentDirName,
        apiPath: [parentDirName, pureFileName].join('/')
    };

    return apiHash;
}

// 获取请求的接口路径
export function fnApiPath(metaUrl) {
    let apiPath = '/' + path.relative(path.resolve('./apis'), url.fileURLToPath(metaUrl)).replace('.js', '').replace(/\\+/, '/');
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
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (_isString(value)) {
            newObj[key] = value.slice(0, 200);
        }
    });
    return _omit(newObj, expludeFields);
}

// 清洗添加数据
export function fnClearInsertData(obj) {
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined) {
            newObj[key] = value;
        }
    });
    if (obj.uuid === null || obj.uuid === undefined) {
        newObj.uuid = fnUUID();
    }
    if (obj.created_at === null || obj.created_at === undefined) {
        newObj.created_at = fnTimestamp();
    }
    if (obj.updated_at === null || obj.updated_at === undefined) {
        newObj.updated_at = fnTimestamp();
    }
    return newObj;
}

// 清洗更新数据
export function fnClearUpdateData(obj) {
    let excludeFields = ['id', 'uuid', 'created_at'];
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined && !excludeFields.includes(key)) {
            newObj[key] = value;
        }
    });
    if (obj.updated_at === null || obj.updated_at === undefined) {
        newObj.updated_at = fnTimestamp();
    }
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

// 加密 md5 值
export function fnMD5(value) {
    return md5(value, appConfig.salt);
}

// 单纯的 md5 值
export function fnPureMD5(value) {
    return md5(value);
}

// 获得分页的偏移值
export function fnPageOffset(page, limit) {
    return (page - 1) * limit;
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
    let _relative = path.relative(from, to);
    let _covertPath = _relative.replace(/\\+/g, '/');

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
    let urls = new URL(url, 'http://127.0.0.1');
    let apiPath = urls.pathname;
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

    let fieldsSort = fieldsArray.sort().join('&');

    let fieldsMd5 = md5(fieldsSort);
    return { sign: fieldsMd5, sort: fieldsSort };
}

/**
 * 检查传参有效性
 */
export function fnApiParamsCheck(req) {
    return new Promise((resolve, reject) => {
        let fields = req.body;

        let fieldsParams = _omit(fields, ['sign']);

        if (_isEmpty(fieldsParams)) {
            return resolve({ code: 0, msg: '接口未带参数' });
        }

        if (!fieldsParams.t) {
            return reject({ code: 1, msg: '接口请求时间无效' });
        }

        let diffTime = Date.now() - Number(fieldsParams.t);
        if (diffTime > appConfig.apiTimeout) {
            return reject({ code: 1, msg: '接口请求时间已过期' });
        }

        let paramsValid = fnApiParamsSign(fieldsParams);

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
export async function fnImport(path, name, defaultValue) {
    try {
        let data = await import(fnFileProtocolPath(path));
        return fnCloneAny(data);
    } catch (err) {
        return fnCloneAny({
            [name]: defaultValue
        });
    }
}

// 获取 file 协议的路径
export function fnFileProtocolPath(_path) {
    if (_startsWith(_path, 'file:')) {
        return _path;
    } else {
        return 'file:///' + _path.replace(/\\+/gi, '/');
    }
}

/**
 * 协议生成函数
 * @param {String} field 字段
 * @param {String} name 名称
 * @param {String} type 类型
 * @param {Integer} min 最小值
 * @param {Integer} max 最大值
 * @param {Array} enumValue 枚举值
 * @param {Any} defaultValue 默认值
 * @param {String} pattern 正则表达式
 * @returns Object Schema 对象
 */
export function fnSchema(hash, name, type, min, max, enumValue, defaultValue, pattern) {
    try {
        // 获取已经存在的公共配置参数
        let fieldData = fnCloneAny(hash || {});

        // 字段协议必须填写名称
        fieldData.title = name;
        if (!name) {
            throw new Error(`缺少字段名称`);
        }

        // 字段必须有正确的类型
        if (!fieldData.type) fieldData.type = type;
        if (sysConfig.schemaFieldType.includes(fieldData.type) === false) {
            throw new Error(`字段 [${name}] 类型 ${fieldData.type} 错误，只能为 ${sysConfig.schemaFieldType.join(',')} 其中之一`);
        }

        // 如果有枚举参数，则忽略最大，最小参数
        if (_isArray(enumValue)) {
            fieldData.enum = enumValue;
        } else {
            if (type === 'integer' || type === 'number') {
                if (min !== undefined && min !== null) fieldData.minimum = min;
                if (max !== undefined && max !== null) fieldData.maximum = max;
            }

            if (type === 'string') {
                if (min !== undefined && min !== null) fieldData.minLength = min;
                if (max !== undefined && max !== null) fieldData.maxLength = max;
                if (pattern !== undefined && pattern !== null) fieldData.pattern = pattern;
            }

            if (defaultValue !== undefined && pattern !== null) fieldData.default = defaultValue;
        }

        return fieldData;
    } catch (err) {
        throw new Error(err);
    }
}

// 获取微信 access_token
export async function fnGetWeixinAccessToken() {
    // https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
    let res = await got('https://api.weixin.qq.com/cgi-bin/token', {
        method: 'GET',
        searchParams: {
            grant_type: 'client_credential',
            appid: appConfig.weixin.appId,
            secret: appConfig.weixin.appSecret
        }
    }).json();
    return res;
}
