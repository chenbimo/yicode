import * as color from 'colorette';
import logSymbols from 'log-symbols';
// 获取查询字段
export function fnField(tableName, fromType, excludeFields = []) {
    const filePath = `./tables/${tableName}.json`;
    // 如果没有 fields 字段
    if (['core', 'app'].includes(fromType) === false) {
        console.log(`${logSymbols.warning} ${color.blueBright(filePath)} fromType 属性必须为 core,app 二者之一，请检查`);
        process.exit(1);
    }
    // 内置的字段
    const innerFields = [
        //
        'id',
        'created_at',
        'updated_at',
        'deleted_at'
    ];
    const tableJson = fnRequire(filePath, {}, fromType);

    // 如果没有 fields 字段
    if (!tableJson?.fields) {
        console.log(`${logSymbols.warning} ${color.blueBright(filePath)} 没有 fields 属性，请检查`);
        process.exit(1);
    }
    let extraFields = {};
    if (fromType === 'core') {
        extraFields = appConfig?.table[`sys_${tableName}`] || {};
    }
    const includeKeys = _omit(_merge(tableJson?.fields || {}, extraFields), excludeFields);
    const allKeys = _uniq(_concat(innerFields, Object.keys(includeKeys)));
    return allKeys;
}
