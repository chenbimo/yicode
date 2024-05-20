export const tableName = '系统菜单表';
export const tableData = {
    pid: {
        name: '父级ID',
        field: {
            type: 'bigInt',
            default: 0,
            isIndex: true
        },
        schema: {
            type: 'integer'
        }
    },
    image: {
        name: '菜单图标',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    name: {
        name: '名称',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    value: {
        name: '路由',
        field: {
            type: 'string',
            default: '',
            isUnique: true
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    sort: {
        name: '字典排序',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    describe: {
        name: '描述',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    is_open: {
        name: '是否公开',
        field: {
            type: 'tinyInt',
            default: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    },
    is_system: {
        name: '是否系统账号（不可删除）',
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
