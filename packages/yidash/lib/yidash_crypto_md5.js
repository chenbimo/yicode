import md5 from 'blueimp-md5';

/**
 * MD5加密
 * @param  {...any} options 参数
 * @returns String
 */
export function yidash_crypto_md5(...options) {
    return md5(...options);
}
