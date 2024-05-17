// 获取 file 协议的路径
export function fnFileProtocolPath(_path) {
    if (_startsWith(_path, 'file:')) {
        return _path;
    } else {
        return pathToFileURL(_path);
    }
}
