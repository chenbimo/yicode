export const tableName = '系统菜单表';
export const tableData = {
    pid: {
        name: '父级ID',
        fieldDefault: 0,
        fieldType: 'bigint',
        schemaType: 'integer',
        index: true
    },
    image: {
        name: '菜单图标',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 300
    },
    name: {
        name: '名称',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 100
    },
    value: {
        name: '路由',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 500,
        unique: true
    },
    sort: {
        name: '字典排序',
        fieldDefault: 0,
        fieldType: 'bigint',
        schemaType: 'integer',
        minimum: 0
    },
    describe: {
        name: '描述',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 500
    },
    is_open: {
        name: '是否公开',
        fieldDefault: 0,
        fieldType: 'tinyint',
        schemaType: 'integer',
        enum: [0, 1]
    },
    is_system: {
        name: '是否系统账号（不可删除）',
        fieldDefault: 0,
        fieldType: 'tinyint',
        schemaType: 'integer',
        enum: [0, 1]
    }
};
