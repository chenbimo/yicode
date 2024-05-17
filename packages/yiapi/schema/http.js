export const httpSchema = {
    title: 'HTTP返回码',
    type: 'object',
    properties: {
        '*': {
            title: '任意字段',
            type: 'object',
            properties: {
                symbol: {
                    title: '唯一符号',
                    type: 'string'
                },
                code: {
                    title: '状态码',
                    type: 'integer',
                    minimum: 0
                },
                msg: {
                    title: '消息内容',
                    type: 'string'
                }
            },
            additionalProperties: false,
            required: ['symbol', 'code', 'msg']
        }
    }
};
