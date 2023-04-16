export default {
    _meta: {
        name: '系统用户表'
    },
    username: {
        type: 'string',
        comment: '用户名',
        length: 30,
        default: ''
    },
    password: {
        type: 'string',
        comment: '密码',
        length: 300,
        default: ''
    },
    nickname: {
        type: 'string',
        comment: '昵称',
        length: 50,
        default: ''
    },
    role_codes: {
        type: 'string',
        comment: '角色码组',
        length: 2000,
        default: ''
    },
    phone: {
        type: 'string',
        comment: '手机号',
        length: 20,
        default: ''
    },
    weixin: {
        type: 'string',
        comment: '微信号',
        length: 30,
        default: ''
    },
    qq: {
        type: 'string',
        comment: 'QQ号',
        length: 30,
        default: ''
    },
    email: {
        type: 'string',
        comment: '邮箱',
        length: 30,
        default: ''
    },
    avatar: {
        type: 'string',
        comment: '头像',
        length: 300,
        default: ''
    },
    bio: {
        type: 'string',
        comment: '签名',
        length: 100,
        default: ''
    },
    describe: {
        type: 'string',
        comment: '描述',
        length: 500,
        default: ''
    },
    is_recommend: {
        type: 'tinyint',
        comment: '是否推荐',
        length: 1,
        default: 0
    },
    is_top: {
        type: 'tinyint',
        comment: '是否置顶',
        length: 1,
        default: 0
    }
};
