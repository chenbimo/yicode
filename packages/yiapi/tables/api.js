import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '系统接口表';
export const tableData = Object.assign(tableExtConfig.sys_api || {}, {
    pid: {
        name: '父级ID',
        type: 'bigInt',
        default: 0,
        isIndex: true,
        min: 1
    },
    pids: {
        name: '父级ID链',
        type: 'string',
        default: '0',
        max: 1000
    },
    name: {
        name: '名称',
        type: 'string',
        default: '',
        max: 100
    },
    value: {
        name: '值',
        type: 'string',
        default: '',
        max: 500
    },
    sort: {
        name: '字典排序',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    describe: {
        name: '描述',
        type: 'string',
        default: '',
        max: 500
    },
    is_bool: {
        name: '真假树',
        type: 'tinyInt',
        default: 0,
        enum: [0, 1]
    },
    is_open: {
        name: '是否公开',
        type: 'tinyInt',
        default: 0,
        enum: [0, 1]
    },
    is_system: {
        name: '是否系统账号（不可删除）',
        type: 'tinyInt',
        default: 0,
        enum: [0, 1]
    }
});
