export const tableData = {
    _name: '系统字典表',
    category_id: {
        name: '分类ID',
        fieldDefault: 0,
        fieldType: 'bigint',
        schemaType: 'integer',
        index: true
    },
    category_code: {
        name: '分类编码',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 50,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$',
        index: true
    },
    code: {
        name: '字典编码',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 50,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    name: {
        name: '字典名称',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 100
    },
    value: {
        name: '字典值',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 500
    },
    symbol: {
        name: '数字类型或字符串类型',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        enum: ['string', 'number']
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
    thumbnail: {
        name: '缩略图',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 300
    },
    is_system: {
        name: '是否系统数据（不可删除）',
        fieldDefault: 0,
        fieldType: 'tinyint',
        schemaType: 'integer',
        enum: [0, 1]
    }
};
