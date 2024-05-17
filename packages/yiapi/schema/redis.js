export const redisSchema = {
    // redis 配置
    title: '缓存配置',
    type: 'object',
    properties: {
        keyPrefix: {
            title: '缓存前缀',
            type: 'string'
        },
        username: {
            title: '用户名',
            type: 'string'
        },
        password: {
            title: '连接密码',
            type: 'string'
        },
        host: {
            title: '主机地址',
            type: 'string'
        },
        db: {
            title: '库序号',
            type: 'number'
        },
        port: {
            title: '监听端口',
            type: 'number'
        }
    },
    additionalProperties: false,
    required: [
        //
        'keyPrefix',
        'username',
        'password',
        'db',
        'host',
        'port'
    ]
};
