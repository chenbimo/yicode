export const tableData = {
    _name: '系统字典分类表',
    code: {
        name: '字典分类编码',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 1,
        maxLength: 50,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    name: {
        name: '字典分类名称',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 1,
        maxLength: 100
    },
    sort: {
        name: '字典分类排序',
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
        minLength: 0,
        maxLength: 500
    }
};
