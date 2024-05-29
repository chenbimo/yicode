const fieldTypeEnum = [
    //
    'string',
    'mediumText',
    'text',
    'bigText',
    'tinyInt',
    'smallInt',
    'mediumInt',
    'int',
    'bigInt',
    'float',
    'double'
];
const schemaTypeEnum = ['string', 'integer', 'number', 'array'];
export const tableSchema = {
    title: '数据库表',
    type: 'object',
    patternProperties: {
        '^[a-z][a-z0-9_]*$': {
            title: '任意字段',
            type: 'object',
            properties: {
                name: {
                    title: '字段名称',
                    type: 'string'
                },
                field: {
                    type: 'object',
                    properties: {
                        type: { title: '类型值', type: 'string', enum: fieldTypeEnum },
                        default: { title: '默认值', type: ['string', 'integer', 'number'] },
                        length: { title: '内容长度', type: 'string', maxLength: 60000 },
                        isIndex: { title: '是否索引', type: 'boolean', default: false },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        isUnsigned: { title: '是否无符号', type: 'boolean', default: false },
                        precision: { title: '整数精度', type: 'integer', minimum: 0, default: 8 },
                        scale: { title: '小数精度', type: 'integer', minimum: 0, default: 2 }
                    },
                    additionalProperties: false,
                    required: ['type']
                },
                schema: {
                    type: 'object',
                    properties: {
                        type: { title: '类型值', type: 'string', enum: schemaTypeEnum },
                        default: { title: '默认值', type: ['string', 'integer', 'number', 'array'] },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        pattern: { title: '模式匹配', type: 'string' },
                        multipleOf: { title: '倍数', type: 'integer', minimum: 1 },
                        items: { title: '数组类型', type: 'string' },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        isAdditional: { title: '是否扩展', type: 'boolean', default: false }
                    },
                    additionalProperties: false,
                    required: ['type']
                }
            },
            additionalProperties: false,
            required: ['name', 'field', 'schema']
        }
    }
};
