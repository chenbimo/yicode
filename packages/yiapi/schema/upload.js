export const uploadSchema = {
    // 文件上传
    title: '上传配置',
    type: 'object',
    properties: {
        dir: {
            type: 'string'
        }
    },
    additionalProperties: false,
    required: ['dir']
};
