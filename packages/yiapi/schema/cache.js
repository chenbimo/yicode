export const cacheSchema = {
    // 定时器配置
    title: '缓存名称配置',
    type: 'object',
    patternProperties: {
        '^[a-z][a-zA-Z0-9_]*$': {
            title: '缓存名称',
            type: 'string'
        }
    },
    additionalProperties: false
};
