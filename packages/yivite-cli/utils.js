import url from 'url';
import path from 'path';
import fg from 'fast-glob';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 使用require方式加载模块
export function requireFrom(path, dv = {}) {
    return require(path) || dv;
}

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
export function fnGetFileProtocolPath(_path) {
    if (_path.startsWith('file:')) {
        return _path;
    } else {
        return 'file://' + path.normalize(_path);
    }
}

export async function fnImportModule(path, defaultValue) {
    try {
        let i = await import(path);
        if (i && i.default) {
            return i.default;
        } else {
            return i;
        }
    } catch (err) {
        return defaultValue;
    }
}

/**
 * 获取所有环境变量.env文件的文件名组成的数组
 * @returns array 环境变量数组
 */
export function fnGetEnvNames(promptParams) {
    let envFiles = fg
        .sync('.env.*', {
            dot: true,
            absolute: false,
            cwd: path.resolve(srcDir, 'env'),
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
