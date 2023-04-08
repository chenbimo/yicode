import { merge } from 'merge-anything';

/**
 * 合并对象
 * @param  {...any} options 参数
 * @returns Object
 */
export function yidash_json_merge(...options) {
    return merge(...options);
}
