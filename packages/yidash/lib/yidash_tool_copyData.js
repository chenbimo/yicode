import copy from 'copy-to-clipboard';
/**
 * 复制数据
 * @param  {...any} options 参数
 * @returns String
 */
export function yidash_tool_copyData(...options) {
    return copy(...options);
}
