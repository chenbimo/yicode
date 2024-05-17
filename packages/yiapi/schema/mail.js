export const mailSchema = {
    // 邮件配置
    title: '邮件配置',
    type: 'object',
    properties: {
        host: {
            title: '主机地址',
            type: 'string'
        },
        port: {
            title: '端口',
            type: 'number'
        },
        pool: {
            title: '是否开启连接池',
            type: 'boolean'
        },
        secure: {
            title: '是否开启 https',
            type: 'boolean'
        },
        user: {
            title: '账号',
            type: 'string'
        },
        pass: {
            title: '密码',
            type: 'string'
        },
        from_name: {
            title: '发送者昵称',
            type: 'string'
        },
        from_email: {
            title: '发送者邮箱',
            type: 'string'
        }
    },
    additionalProperties: false,
    required: [
        //
        'host',
        'port',
        'pool',
        'secure',
        'user',
        'pass',
        'from_name',
        'from_email'
    ]
};
