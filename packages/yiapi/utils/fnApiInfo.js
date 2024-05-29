export function fnFilename(metaUrl) {
    return fileURLToPath(metaUrl);
}

export function fnDirname(metaUrl) {
    const filename = fileURLToPath(metaUrl);
    return path.dirname(filename);
}

// 获取文件名（不包括扩展名）
export function fnApiInfo(metaUrl) {
    const _filename = fnFilename(metaUrl);
    const _dirname = fnDirname(metaUrl);

    const pureFileName = path.basename(_filename, '.js');

    const parentDirName = _dirname.replace(/\\+/gi, '/').replace(/.+\/apis/, '');

    const metaFile = path.dirname(metaUrl) + '/_meta.js';

    const apiData = {
        pureFileName: pureFileName,
        parentDirName: parentDirName,
        apiPath: [parentDirName, pureFileName].join('/')
    };

    return apiData;
}
