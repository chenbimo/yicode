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
