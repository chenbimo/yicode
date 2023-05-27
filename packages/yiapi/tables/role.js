export const tableSchema = {
    name: '系统角色表',
    fields: {
        code: {
            type: 'string',
            comment: '角色编码',
            length: 50,
            default: ''
        },
        name: {
            type: 'string',
            comment: '角色名称',
            length: 100,
            default: ''
        },
        describe: {
            type: 'string',
            comment: '角色描述',
            length: 500,
            default: ''
        },
        menu_ids: {
            type: 'string',
            comment: '角色菜单',
            length: 5000,
            default: ''
        },
        api_ids: {
            type: 'string',
            comment: '角色接口',
            length: 5000,
            default: ''
        },
        sort: {
            type: 'bigint',
            comment: '角色排序',
            default: 0
        },
        is_system: {
            type: 'tinyint',
            comment: '是否系统角色（不可删除）',
            length: 1,
            default: 0
        }
    }
};
