import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '系统字典分类表';
export const tableData = Object.assign(tableExtConfig.sys_dict_category || {}, {
    code: {
        name: '字典分类编码',
        type: 'string',
        default: '',
        min: 1,
        max: 50,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    name: {
        name: '字典分类名称',
        type: 'string',
        default: '',
        min: 1,
        max: 100
    },
    sort: {
        name: '字典分类排序',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    describe: {
        name: '描述',
        type: 'string',
        default: '',
        min: 0,
        max: 500
    }
});
