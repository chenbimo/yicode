import url from 'node:url';
import path from 'node:path';
import fg from 'fast-glob';
import { copy as copyAny } from 'copy-anything';
import { cloneDeep, startsWith } from 'lodash-es';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cwd } from 'node:process';

// 系统路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

export const sysConfig = {
    appDir: cwd(),
    yiapiDir: __dirname
    // 内置表字段定义
};

export function fnFilename(metaUrl) {
    return url.fileURLToPath(metaUrl);
}

export function fnPureFilename(metaUrl) {
    return path.basename(fnFilename(metaUrl)).split('.')[0];
}

export function fnDirname(metaUrl) {
    const filename = url.fileURLToPath(metaUrl);
    return path.dirname(filename);
}

// 获取file协议的路径
export function fnFileProtocolPath(_path) {
    if (startsWith(_path, 'file:')) {
        return _path;
    } else {
        return 'file:///' + _path.replace(/\\+/gi, '/');
    }
}

/**
 * 可控导入
 * @param {String} path 导入路径
 * @param {Any} default 默认值
 */
export async function fnImport(path, name, defaultValue) {
    try {
        let data = await import(path);
        return copyAny(data);
    } catch (err) {
        return copyAny({
            [name]: defaultValue
        });
    }
}

// export async function fnImportModule(path, defaultValue) {
//     try {
//         let i = await import(path);
//         if (i && i.default) {
//             return i.default;
//         } else {
//             return i;
//         }
//     } catch (err) {
//         return defaultValue;
//     }
// }

/**
 * 获取所有环境变量.env文件的文件名组成的数组
 * @returns array 环境变量数组
 */
export function fnGetEnvNames(promptParams) {
    let envFiles = fg
        .sync('.env.*', {
            dot: true,
            absolute: false,
            cwd: path.resolve(sysConfig.appDir, 'src/env'),
            onlyFiles: true,
            ignore: ['.env.*.local']
        })
        .map((fileName) => {
            return fileName.replace('.env.', '');
        });
    return envFiles;
}

// 排除掉无用的属性
export function fnOmit(obj, exclude = []) {
    let obj2 = {};
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            if (exclude.includes(prop) === false) {
                obj2[prop] = obj[prop];
            }
        }
    }
    return obj2;
}

export function fnRequire(filePath, defaultValue) {
    try {
        const require = createRequire(fnFileProtocolPath(path.resolve(process.cwd())));
        const result = require(filePath);
        return result;
    } catch (err) {
        return defaultValue;
    }
}
