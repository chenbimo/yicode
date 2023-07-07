import pako from 'pako';
// zip压缩
export function yidash_string_deflate(str) {
    return btoa(pako.deflate(encodeURIComponent(str), { to: 'string' }));
}
