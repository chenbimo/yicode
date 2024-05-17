export const freeApisSchema = {
    // 任何情况下可以访问的路由
    title: '自由接口',
    type: 'array',
    items: {
        type: 'string'
    },
    uniqueItems: true
};
