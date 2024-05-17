export const whiteApisSchema = {
    // 白名单接口，登录后访问无限制
    title: '白名单接口',
    type: 'array',
    items: {
        type: 'string'
    },
    uniqueItems: true
};
