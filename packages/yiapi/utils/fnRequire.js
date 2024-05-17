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
