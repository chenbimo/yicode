// 补全空对象

export function fnRepairEmptyData(obj, expludeFields = ['id']) {
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined) {
            newObj[key] = value;
        } else {
            newObj[key] = '';
        }
    });
    return _omit(newObj, expludeFields);
}
