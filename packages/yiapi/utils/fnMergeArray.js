// 自定义对象数组合并策略
export function fnMergeArray(target, source) {
    const result = _mergeWith(
        //
        target,
        source,
        (obj, src) => {
            if (_isArray(obj?.children) && _isArray(src?.children)) {
                obj.children = obj?.children.concat(src?.children);
                return obj;
            }
        }
    );

    return result;
}
