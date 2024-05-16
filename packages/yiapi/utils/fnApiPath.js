// 获取请求的接口路径
export function fnApiPath(metaUrl) {
    const apiPath = '/' + path.relative(path.resolve('./apis'), fileURLToPath(metaUrl)).replace('.js', '').replace(/\\+/, '/');
    return apiPath;
}
