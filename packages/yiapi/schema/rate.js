export const rateSchema = {
    // 请求限速
    title: '请求频率',
    type: 'object',
    properties: {
        global: {
            type: 'boolean',
            title: '是否影响全部的路由'
        },
        max: {
            type: 'number',
            title: '限制时间内的最大请求数'
        },
        timeWindow: {
            type: 'number',
            title: '限制时间'
        },
        hook: {
            type: 'string',
            title: '触发的钩子'
        },
        cache: {
            type: 'number',
            title: '内存缓存大小'
        },
        allowList: {
            type: 'array',
            title: '白名单'
        }
    },
    additionalProperties: false
};
