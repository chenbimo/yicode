export function fnDbInsert(obj) {
    let newObj = {};
    _forOwn(obj, (value, key) => {
        if (value !== null && value !== undefined) {
            newObj[key] = value;
        }
    });
    newObj.created_at = Date.now();
    newObj.updated_at = Date.now();
    if (appConfig.tablePrimaryKey !== 'default') {
        // 当主键为 time 模式时，更改 id 字段的值
        if (appConfig.tablePrimaryKey === 'time') {
            newObj.id = fnIncrUID();
        }
    }
    return newObj;
}
