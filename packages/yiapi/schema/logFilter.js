export const logFilterSchema = {
    title: '日志字段过滤',
    type: 'array',
    items: {
        type: 'string'
    },
    uniqueItems: true
};
