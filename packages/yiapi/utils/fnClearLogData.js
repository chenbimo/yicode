// 减少日志过长的内容
export function fnClearLogData(obj, expludeFields = []) {
    const objNew = _cloneDeep(_omit(obj, expludeFields));
    // fnObjTraverse(objNew, {
    //     processValue: (key, value, level, path, isObjectRoot, isArrayElement, cbSetValue) => {
    //         if (_isString(value)) {
    //             cbSetValue(value.slice(0, 100));
    //         }
    //     }
    // });
    return objNew;
}
