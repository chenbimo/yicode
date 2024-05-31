import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '系统目录表';
export const tableData = Object.assign(tableExtConfig.sys_tree || {}, {
    pid: {
        name: '父级ID',
        type: 'bigInt',
        default: 0,
        isIndex: true,
        min: 0
    },
    pids: {
        name: '父级ID链',
        type: 'string',
        default: '0',
        max: 10000
    },
    level: {
        name: '目录层级',
        type: 'tinyInt',
        default: 1,
        min: 1
    },
    category: {
        name: '分类编码',
        type: 'string',
        default: '',
        max: 100,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    image: {
        name: '图标',
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
    thumbnail: {
        name: '缩略图',
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
