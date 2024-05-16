export function fnDbUpdateData(obj) {
    const excludeFields = ['id', 'created_at'];
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined && !excludeFields.includes(key)) {
            newObj[key] = value;
        }
    });
    newObj.updated_at = Date.now();
    return newObj;
}
