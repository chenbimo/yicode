import pako from 'pako';
// 解压
export function yidash_string_inflate(b64Data) {
    const strData = atob(b64Data);
    const charData = strData.split('').map(function (x) {
        return x.charCodeAt(0);
    });
    const binData = new Uint8Array(charData);
    const data = pako.inflate(binData);
    const array = new Uint16Array(data);
    // 防止一次解压造成内存溢出，这里进行分段解压
    let result = '';
    let i = 0;
    const maxRange = 8 * 1024;
    for (i = 0; i < array.length / maxRange; i++) {
        result += String.fromCharCode.apply(null, array.slice(i * maxRange, (i + 1) * maxRange));
    }
    result += String.fromCharCode.apply(null, array.slice(i * maxRange));
    return decodeURIComponent(result);
}
