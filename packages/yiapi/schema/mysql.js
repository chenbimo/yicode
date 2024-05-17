export const mysqlSchema = {
    // 数据库配置
    title: '数据库配合',
    type: 'object',
    properties: {
        db: {
            title: '数据库名称',
            type: 'string'
        },
        username: {
            title: '用户名',
            type: 'string'
        },
        password: {
            title: '密码',
            type: 'string'
        },
        host: {
            title: '主机地址',
            type: 'string'
        },
        port: {
            title: '监听端口',
            type: 'number'
        }
    },
    additionalProperties: false,
    required: [
        //
        'db',
        'username',
        'password',
        'host',
        'port'
    ]
};
