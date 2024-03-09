/**
 * 地址转换为短地址形式
 */
export function address_short(address) {
    if (!address) return '';
    const addressSplit = address.split('');
    const result = [
        //
        addressSplit.slice(0, 4).join(''),
        '...',
        addressSplit.slice(-4).join('')
    ].join('');

    return result;
}
