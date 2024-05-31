import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '系统菜单表';
export const tableData = Object.assign(tableExtConfig.sys_menu || {}, {
    pid: {
        name: '父级ID',
        type: 'bigInt',
        default: 0,
        isIndex: true,
        min: 0
    },
    image: {
        name: '菜单图标',
        type: 'string',
        default: '',
        max: 500
    },
    name: {
        name: '名称',
        type: 'string',
        default: '',
        max: 100
    },
    value: {
        name: '路由',
        type: 'string',
        default: '',
        isUnique: true,
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
