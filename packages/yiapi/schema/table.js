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
                        type: {
                            type: 'string',
                            enum: [
                                //
                                'string',
                                'tinyText',
                                'smallText',
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
                            ]
                        }
                    },
                    required: ['type'],
                    anyOf: [
                        {
                            if: {
                                anyOf: [
                                    //
                                    { properties: { type: { const: 'string' } } }
                                ]
                            },
                            then: {
                                properties: {
                                    default: {
                                        title: '默认值',
                                        type: 'string'
                                    },
                                    length: {
                                        title: '内容长度',
                                        type: 'string',
                                        maxLength: 60000
                                    },
                                    isIndex: {
                                        title: '是否索引',
                                        type: 'boolean',
                                        default: false
                                    },
                                    isUnique: {
                                        title: '是否唯一',
                                        type: 'boolean',
                                        default: false
                                    }
                                },
                                additionalProperties: false
                            }
                        },
                        {
                            if: {
                                anyOf: [
                                    //
                                    { properties: { type: { const: 'tinyText' } } },
                                    { properties: { type: { const: 'smallText' } } },
                                    { properties: { type: { const: 'mediumText' } } },
                                    { properties: { type: { const: 'text' } } },
                                    { properties: { type: { const: 'bigText' } } }
                                ]
                            },
                            then: {
                                properties: {},
                                additionalProperties: false
                            }
                        },
                        {
                            if: {
                                anyOf: [
                                    //
                                    { properties: { type: { const: 'tinyInt' } } },
                                    { properties: { type: { const: 'smallInt' } } },
                                    { properties: { type: { const: 'mediumInt' } } },
                                    { properties: { type: { const: 'int' } } },
                                    { properties: { type: { const: 'bigInt' } } }
                                ]
                            },
                            then: {
                                properties: {
                                    default: {
                                        title: '默认值',
                                        type: 'string'
                                    },
                                    isIndex: {
                                        title: '是否索引',
                                        type: 'boolean',
                                        default: false
                                    },
                                    isUnique: {
                                        title: '是否唯一',
                                        type: 'boolean',
                                        default: false
                                    },
                                    isUnsigned: {
                                        title: '是否无符号',
                                        type: 'boolean',
                                        default: true
                                    }
                                },
                                additionalProperties: false
                            }
                        },
                        {
                            if: {
                                anyOf: [
                                    //
                                    { properties: { type: { const: 'float' } } },
                                    { properties: { type: { const: 'double' } } }
                                ]
                            },
                            then: {
                                properties: {
                                    default: {
                                        title: '默认值',
                                        type: 'string'
                                    },
                                    isIndex: {
                                        title: '是否索引',
                                        type: 'boolean',
                                        default: false
                                    },
                                    isUnique: {
                                        title: '是否唯一',
                                        type: 'boolean',
                                        default: false
                                    },
                                    precision: {
                                        title: '整数精度',
                                        type: 'integer',
                                        minimum: 0,
                                        default: 8
                                    },
                                    scale: {
                                        title: '小数精度',
                                        type: 'integer',
                                        minimum: 0,
                                        default: 2
                                    }
                                },
                                additionalProperties: false
                            }
                        }
                    ]
                },
                schema: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            enum: [
                                //
                                'string',
                                'integer',
                                'number',
                                'array'
                            ]
                        }
                    },
                    required: ['type'],
                    anyOf: [
                        {
                            if: {
                                anyOf: [
                                    //
                                    { properties: { type: { const: 'string' } } }
                                ]
                            },
                            then: {
                                properties: {
                                    default: {
                                        title: '默认值',
                                        type: 'string'
                                    },
                                    min: {
                                        title: '最小长度',
                                        type: 'integer',
                                        minimum: 0
                                    },
                                    max: {
                                        title: '最大长度',
                                        type: 'integer'
                                    },
                                    enum: {
                                        title: '枚举值',
                                        type: 'array'
                                    },
                                    pattern: {
                                        title: '模式匹配',
                                        type: 'string'
                                    }
                                },
                                additionalProperties: false,
                                required: ['max']
                            }
                        },
                        {
                            if: {
                                anyOf: [
                                    //
                                    { properties: { type: { const: 'integer' } } },
                                    { properties: { type: { const: 'number' } } }
                                ]
                            },
                            then: {
                                properties: {
                                    default: {
                                        title: '默认值',
                                        type: 'number'
                                    },
                                    min: {
                                        title: '最小值',
                                        type: 'integer'
                                    },
                                    max: {
                                        title: '最大值',
                                        type: 'integer'
                                    },
                                    enum: {
                                        title: '枚举值',
                                        type: 'array'
                                    },
                                    multipleOf: {
                                        title: '倍数',
                                        type: 'integer',
                                        minimum: 1
                                    }
                                },
                                additionalProperties: false
                            }
                        },
                        {
                            if: {
                                anyOf: [
                                    //
                                    { properties: { type: { const: 'array' } } }
                                ]
                            },
                            then: {
                                properties: {
                                    default: {
                                        title: '默认值',
                                        type: 'number'
                                    },
                                    min: {
                                        title: '最小项数',
                                        type: 'integer'
                                    },
                                    max: {
                                        title: '最大项数',
                                        type: 'integer'
                                    },
                                    enum: {
                                        title: '枚举值',
                                        type: 'array'
                                    },
                                    items: {
                                        title: '数组类型',
                                        type: 'string'
                                    },
                                    isUniqueItems: {
                                        title: '是否唯一',
                                        type: 'boolean',
                                        default: false
                                    },
                                    isAdditionalItems: {
                                        title: '是否扩展',
                                        type: 'boolean',
                                        default: false
                                    }
                                },
                                additionalProperties: false,
                                required: ['items']
                            }
                        }
                    ]
                }
            },
            additionalProperties: false,
            required: ['name', 'field', 'schema']
        }
    }
};
