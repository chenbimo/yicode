import { appConfig } from '../config/app.js';
import { fnIncrUID } from '../utils/fnIncrUID.js';

export function fnDbInsert(obj) {
    const newObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] !== null && obj[key] !== undefined) {
                newObj[key] = obj[key];
            }
        }
    }
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
