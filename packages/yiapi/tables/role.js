import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '系统角色表';
export const tableData = Object.assign(tableExtConfig.sys_role || {}, {
    code: {
        name: '角色编码',
        type: 'string',
        default: '',
        max: 50,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    name: {
        name: '角色名称',
        type: 'string',
        default: '',
        max: 100
    },
    describe: {
        name: '角色描述',
        type: 'string',
        default: '',
        max: 500
    },
    menu_ids: {
        name: '角色菜单',
        type: 'mediumText',
        default: '',
        max: 50000
    },
    api_ids: {
        name: '角色接口',
        type: 'mediumText',
        default: '',
        max: 50000
    },
    sort: {
        name: '角色排序',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    is_system: {
        name: '是否系统角色（不可删除）',
        type: 'tinyInt',
        default: 0,
        enum: [0, 1]
    }
});
