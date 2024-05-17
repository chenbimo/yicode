export const jwtSchema = {
    // jwt 配置
    title: 'jwt 配置',
    type: 'object',
    properties: {
        secret: {
            title: '加密字符',
            type: 'string'
        },
        expiresIn: {
            title: '过期时间',
            type: 'string'
        }
    },
    additionalProperties: false,
    required: [
        //
        'secret',
        'expiresIn'
    ]
};
