export const schemaFieldSchema = {
    title: '协议字段',
    type: 'object',
    properties: {
        '*': {
            title: '任意字段',
            type: 'object',
            properties: {
                name: {
                    title: '名称',
                    type: 'string'
                },
                schemaType: {
                    title: '类型',
                    type: 'string',
                    enum: ['string', 'integer', 'number', 'array']
                },
                schemaDefault: {
                    title: '默认值'
                },
                minLength: {
                    title: '最小长度',
                    type: 'integer',
                    miniumn: 0
                },
                maxLength: {
                    title: '最大长度',
                    type: 'integer',
                    miniumn: 0
                },
                pattern: {
                    title: '模式匹配',
                    type: 'string'
                },
                miniumn: {
                    title: '最小值',
                    type: 'integer'
                },
                maxiumn: {
                    title: '最大值',
                    type: 'integer'
                },
                exclusiveMinimum: {
                    title: '开-最小值',
                    type: 'integer'
                },
                exclusiveMaximum: {
                    title: '开-最大值',
                    type: 'integer'
                },
                multipleOf: {
                    title: '倍数',
                    type: 'integer',
                    minimum: 0
                },
                times: {
                    title: '数组配置',
                    type: 'string'
                },
                minItems: {
                    title: '最小数组项',
                    type: 'integer',
                    minimum: 0
                },
                maxItems: {
                    title: '最大数组项',
                    type: 'integer',
                    minimum: 0
                },
                uniqueItems: {
                    title: '数组是否唯一',
                    type: 'boolean',
                    default: false
                },
                additionalItems: {
                    title: '数组属性扩展',
                    type: 'boolean',
                    default: false
                },
                enum: {
                    title: '枚举值',
                    type: 'array'
                }
            },
            additionalProperties: false,
            required: ['name', 'schemaType']
        }
    }
};
