export const cronSchema = {
    // 定时器配置
    title: '定时器',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            timer: {
                title: '定时器',
                type: 'string'
            },
            name: {
                title: '定时器名称',
                type: 'string'
            },
            code: {
                title: '定时器代号',
                type: 'string'
            },
            maxRuns: {
                title: '最大运行次数',
                type: 'number'
            },
            timezone: {
                title: '时区',
                type: 'string'
            },
            handler: {
                title: '处理函数'
            }
        },
        additionalProperties: false,
        required: ['timer', 'handler', 'name', 'code']
    }
};
