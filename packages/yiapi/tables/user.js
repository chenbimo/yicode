export const tableName = '系统用户表';
export const tableData = {
    openid: {
        name: '微信 openid',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 100,
        index: true
    },
    agent_id: {
        name: '上级ID',
        fieldDefault: 0,
        fieldType: 'bigint',
        schemaType: 'integer',
        minimum: 0,
        index: true
    },
    from_product: {
        name: '来自产品',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 100
    },
    username: {
        name: '用户名',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 30
    },
    password: {
        name: '密码',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 300
    },
    nickname: {
        name: '昵称',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 50
    },
    role: {
        name: '角色',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 2000
    },
    phone: {
        name: '手机号',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 20
    },
    weixin: {
        name: '微信号',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 30
    },
    qq: {
        name: 'QQ号',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 30
    },
    email: {
        name: '邮箱',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 30
    },
    avatar: {
        name: '头像',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 300
    },
    bio: {
        name: '签名',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 100
    },
    describe: {
        name: '描述',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 500
    },
    is_recommend: {
        name: '是否推荐',
        fieldDefault: 0,
        fieldType: 'tinyint',
        schemaType: 'integer',
        enum: [0, 1]
    },
    is_top: {
        name: '是否置顶',
        fieldDefault: 0,
        fieldType: 'tinyint',
        schemaType: 'integer',
        enum: [0, 1]
    }
};
