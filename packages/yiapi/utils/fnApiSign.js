import md5 from 'blueimp-md5';
// 请求参数签名
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
