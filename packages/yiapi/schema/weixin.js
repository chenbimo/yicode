export const weixinSchema = {
    title: '微信配置',
    type: 'object',
    properties: {
        // 商户配置
        mchId: {
            title: '商户号',
            type: 'string'
        },
        serialNo: {
            title: '支付序列号',
            type: 'string'
        },
        apiv3PrivateKey: {
            title: '支付秘钥',
            type: 'string'
        },
        privateKey: {
            title: '商户私钥',
            type: 'string'
        },
        // 公众号配置
        // appId
        appId: {
            title: '公众号appId',
            type: 'string'
        },
        // appSecret
        appSecret: {
            title: '公众号密钥',
            type: 'string'
        },
        // 支付回调地址
        notifyUrl: {
            title: '支付通知地址',
            type: 'string'
        }
    },
    additionalProperties: false,
    required: ['mchId', 'serialNo', 'apiv3PrivateKey', 'privateKey', 'appId', 'appSecret', 'notifyUrl']
};
