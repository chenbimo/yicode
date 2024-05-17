export const paymentSchema = {
    // 支付配置
    title: '支付配置',
    type: 'array',
    items: {
        type: 'object',
        properties: {
            // 产品名称
            name: {
                title: '产品名称',
                type: 'string',
                minLength: 1,
                maxLength: 20
            },
            // 产品代号
            product: {
                title: '产品代号',
                type: 'integer',
                minimum: 1
            },
            // 支付代号
            code: {
                title: '支付代号',
                type: 'integer',
                minimum: 1
            },
            // 时长 0=永久 非0=秒
            duration: {
                title: '购买时间（秒）',
                type: 'integer',
                minimum: 0
            },
            // 价格 分
            money: {
                title: '购买价格（分）',
                type: 'integer',
                minimum: 1
            }
        },
        additionalProperties: false,
        required: ['name', 'product', 'code', 'duration', 'money']
    }
};
