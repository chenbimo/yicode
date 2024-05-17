export const dbFieldSchema = {
    title: '库表字段',
    type: 'object',
    properties: {
        '*': {
            title: '任意字段',
            type: 'object',
            properties: {
                type: {
                    title: '字段类型',
                    type: 'string'
                },
                args: {
                    title: '字段参数',
                    type: 'array'
                }
            },
            additionalProperties: false,
            required: ['type', 'args']
        }
    }
};
