/**
 *
 * @param {Array} data 数组对象
 * @param {String} field 要查找的属性
 * @param {String | Number} value 属性的值
 * @returns Object 匹配的对象
 */
export const yd_data_findObj = (data, field, value) => {
    let result = {};
    for (let item of data) {
        for (let prop in item) {
            if (item.hasOwnProperty(prop)) {
                if (prop === field && item[prop] === value) {
                    result = item;
                    break;
                }
            }
        }
    }
    return result;
};
