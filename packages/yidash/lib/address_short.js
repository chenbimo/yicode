/**
 * 地址转换为短地址形式
 */
export function address_short(address) {
    let addressSplit = address.split('');
    let result = [
        //
        addressSplit.slice(0, 4).join(''),
        '...',
        addressSplit.slice(-4).join('')
    ].join('');

    return result;
}
