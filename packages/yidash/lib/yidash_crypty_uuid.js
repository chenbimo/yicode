import { nanoid } from 'nanoid';

/**
 * 返回UUID
 * @param  {...any} options 参数
 * @returns String
 */
export function yidash_crypty_uuid(...options) {
    return nanoid(...options);
}
