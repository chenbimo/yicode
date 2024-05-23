export const tableName = '系统角色表';
export const tableData = {
    code: {
        name: '角色编码',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 50,
            pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
        }
    },
    name: {
        name: '角色名称',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    describe: {
        name: '角色描述',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    menu_ids: {
        name: '角色菜单',
        field: {
            type: 'mediumText'
        },
        schema: {
            type: 'array',
            items: 'integer',
            default: []
        }
    },
    api_ids: {
        name: '角色接口',
        field: {
            type: 'mediumText'
        },
        schema: {
            type: 'array',
            items: 'integer',
            default: []
        }
    },
    sort: {
        name: '角色排序',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    is_system: {
        name: '是否系统角色（不可删除）',
        field: {
            type: 'tinyInt',
            default: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    }
};
