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

// {
//     name: { title: '字段名称', type: 'string' },
//     default: { title: '默认值', type: ['string', 'integer', 'number'] },
//     isIndex: { title: '是否索引', type: 'boolean', default: false },
//     isUnique: { title: '是否唯一', type: 'boolean', default: false },
//     isUnsigned: { title: '是否无符号', type: 'boolean', default: false },
//     precision: { title: '整数精度', type: 'integer', minimum: 0, default: 8 },
//     scale: { title: '小数精度', type: 'integer', minimum: 0, default: 2 },
//     default2: { title: '默认值', type: ['string', 'integer', 'number'] },
//     min: { title: '最小长度', type: 'integer', minimum: 0 },
//     max: { title: '最大长度', type: 'integer' },
//     enum: { title: '枚举值', type: 'array' },
//     pattern: { title: '模式匹配', type: 'string' },
//     multipleOf: { title: '倍数', type: 'integer', minimum: 1 }
// }

export const tableSchema = {
    title: '数据库表',
    type: 'object',
    additionalProperties: false,
    patternProperties: {
        '^[a-z][a-z0-9_]*$': {
            title: '任意字段',
            type: 'object',
            properties: {
                type: { title: '数据类型', type: 'string', enum: fieldTypeEnum }
            },
            required: ['type'],
            oneOf: [
                {
                    properties: {
                        type: { const: 'string' },
                        name: { title: '字段名称', type: 'string' },
                        default: { title: '默认值', type: 'string' },
                        isIndex: { title: '是否索引', type: 'boolean', default: false },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        default2: { title: '默认值', type: 'string' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        pattern: { title: '模式匹配', type: 'string' }
                    },
                    additionalProperties: false
                },
                {
                    properties: {
                        type: { const: 'mediumText' },
                        name: { title: '字段名称', type: 'string' },
                        default2: { title: '默认值', type: 'string' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        pattern: { title: '模式匹配', type: 'string' }
                    }
                },
                {
                    properties: {
                        type: { const: 'text' },
                        name: { title: '字段名称', type: 'string' },
                        default2: { title: '默认值', type: 'string' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        pattern: { title: '模式匹配', type: 'string' }
                    }
                },
                {
                    properties: {
                        type: { const: 'bigText' },
                        name: { title: '字段名称', type: 'string' },
                        default2: { title: '默认值', type: 'string' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        pattern: { title: '模式匹配', type: 'string' }
                    }
                },
                {
                    properties: {
                        type: { const: 'tinyInt' },
                        name: { title: '字段名称', type: 'string' },
                        default: { title: '默认值', type: 'integer' },
                        isIndex: { title: '是否索引', type: 'boolean', default: false },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        isUnsigned: { title: '是否无符号', type: 'boolean', default: false },
                        default2: { title: '默认值', type: 'integer' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        multipleOf: { title: '倍数', type: 'integer', minimum: 1 }
                    }
                },
                {
                    properties: {
                        type: { const: 'smallInt' },
                        name: { title: '字段名称', type: 'string' },
                        default: { title: '默认值', type: 'integer' },
                        isIndex: { title: '是否索引', type: 'boolean', default: false },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        isUnsigned: { title: '是否无符号', type: 'boolean', default: false },
                        default2: { title: '默认值', type: 'integer' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        multipleOf: { title: '倍数', type: 'integer', minimum: 1 }
                    }
                },
                {
                    properties: {
                        type: { const: 'int' },
                        name: { title: '字段名称', type: 'string' },
                        default: { title: '默认值', type: 'integer' },
                        isIndex: { title: '是否索引', type: 'boolean', default: false },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        isUnsigned: { title: '是否无符号', type: 'boolean', default: false },
                        default2: { title: '默认值', type: 'integer' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        multipleOf: { title: '倍数', type: 'integer', minimum: 1 }
                    }
                },
                {
                    properties: {
                        type: { const: 'mediumInt' },
                        name: { title: '字段名称', type: 'string' },
                        default: { title: '默认值', type: 'integer' },
                        isIndex: { title: '是否索引', type: 'boolean', default: false },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        isUnsigned: { title: '是否无符号', type: 'boolean', default: false },
                        default2: { title: '默认值', type: 'integer' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        multipleOf: { title: '倍数', type: 'integer', minimum: 1 }
                    }
                },
                {
                    properties: {
                        type: { const: 'bigInt' },
                        name: { title: '字段名称', type: 'string' },
                        default: { title: '默认值', type: 'integer' },
                        isIndex: { title: '是否索引', type: 'boolean', default: false },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        isUnsigned: { title: '是否无符号', type: 'boolean', default: false },
                        default2: { title: '默认值', type: 'integer' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        multipleOf: { title: '倍数', type: 'integer', minimum: 1 }
                    }
                },
                {
                    properties: {
                        type: { const: 'float' },
                        name: { title: '字段名称', type: 'string' },
                        default: { title: '默认值', type: 'number' },
                        isIndex: { title: '是否索引', type: 'boolean', default: false },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        isUnsigned: { title: '是否无符号', type: 'boolean', default: false },
                        precision: { title: '整数精度', type: 'integer', minimum: 0, default: 8 },
                        scale: { title: '小数精度', type: 'integer', minimum: 0, default: 2 },
                        default2: { title: '默认值', type: 'number' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        multipleOf: { title: '倍数', type: 'integer', minimum: 1 }
                    }
                },
                {
                    properties: {
                        type: { const: 'double' },
                        name: { title: '字段名称', type: 'string' },
                        default: { title: '默认值', type: 'number' },
                        isIndex: { title: '是否索引', type: 'boolean', default: false },
                        isUnique: { title: '是否唯一', type: 'boolean', default: false },
                        isUnsigned: { title: '是否无符号', type: 'boolean', default: false },
                        precision: { title: '整数精度', type: 'integer', minimum: 0, default: 8 },
                        scale: { title: '小数精度', type: 'integer', minimum: 0, default: 2 },
                        default2: { title: '默认值', type: 'number' },
                        min: { title: '最小长度', type: 'integer', minimum: 0 },
                        max: { title: '最大长度', type: 'integer' },
                        enum: { title: '枚举值', type: 'array' },
                        multipleOf: { title: '倍数', type: 'integer', minimum: 1 }
                    }
                }
            ]
        }
    }
};
