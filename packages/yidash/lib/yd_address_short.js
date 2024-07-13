/**
 * 地址转换为短地址形式
 */
export function yd_address_short(address, startNum = 4, endNum = 4) {
    if (!address) return '';
    const addressStr = String(address);
    if (addressStr.length < startNum + endNum) return addressStr;
    const addressSplit = addressStr.split('');
    const result = [
        //
        addressSplit.slice(0, startNum).join(''),
        '***',
        addressSplit.slice(-endNum).join('')
    ].join('');

    return result;
}
