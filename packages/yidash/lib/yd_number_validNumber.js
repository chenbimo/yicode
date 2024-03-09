/**
 * 返回有效数字
 * @param {Number} number 数字传参
 * @param {String} symbol 符号（默认：-0+，表示允许负数，0和正数）
 * @param {Number} decimalPlaces - 小数位数
 * @returns {Number} 如果数字有效，则返回当前值，否则返回上一个有效值
 * @summary 应用场景：强制输入框必须输入有效值，如果值无效，则显示上一步的值
 */
export function yd_number_validNumber(number, symbol = '-0+', decimalPlaces = 2) {
    // 最后一个数字
    let lastNumber = '';
    return function (number) {
        // 双层转换，保证得到一个字符串数字转换后的数字 (真实数字)
        let stringNumber = String(number);
        let realNumber = Number(stringNumber);

        // 如果确实是一个数字
        if (Number.isNaN(realNumber) === false) {
            if (stringNumber.endsWith('.')) {
                return number;
            }
            // 将当前值缓存
            let finallyNumber = realNumber.toFixed(decimalPlaces);
            lastNumber = finallyNumber;
            return finallyNumber;
        } else {
            return lastNumber;
        }
    };
}
