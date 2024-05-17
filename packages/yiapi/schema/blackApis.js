export const blackApisSchema = {
    // 黑名单接口，不可访问的接口
    title: '黑名单接口',
    type: 'array',
    items: {
        type: 'string'
    },
    uniqueItems: true
};
