/**
 * 设置vue模板引用
 * @param {Object} from 引用集合对象
 * @param {String} name 引用名称
 * @param {Object} el 应用元素
 * @returns null
 */
export function yidash_vue_setRef(from, name, el) {
    from[name] = el;
}
