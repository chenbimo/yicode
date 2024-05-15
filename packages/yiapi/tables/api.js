export default {
    name: '系统接口表',
    fields: {
        pid: {
            name: '父级ID',
            fieldDefault: 0,
            fieldType: 'bigint',
            schemaType: 'integer',
            minimum: 1,
            index: true
        },
        pids: {
            name: '父级ID链',
            fieldDefault: '0',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 1000
        },
        level: {
            name: '目录层级',
            fieldDefault: 1,
            fieldType: 'tinyint',
            schemaType: 'integer',
            minimum: 1
        },
        name: {
            name: '名称',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 100
        },
        value: {
            name: '值',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 500
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
        is_bool: {
            name: '真假树',
            fieldDefault: 0,
            fieldType: 'tinyint',
            schemaType: 'integer',
            enum: [0, 1]
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
    }
};
