import pako from 'pako';
// 压缩
export function yidash_string_deflate(str) {
    return btoa(pako.deflate(encodeURIComponent(str), { to: 'string' }));
}
