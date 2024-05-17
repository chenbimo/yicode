export const productSchema = {
    // 产品配置
    title: '产品配置',
    type: 'object',
    properties: {
        '*': {
            type: 'integer',
            minimum: 1
        }
    }
};
