export default {
    _meta: {
        name: '管理员'
    },
    role_codes: {
        type: 'string',
        name: '角色码组',
        comment: '角色码组',
        length: 2000,
        default: '',
        schema: {
            type: 'string'
        }
    },
    username: {
        type: 'string',
        name: '用户名',
        comment: '用户名',
        length: 20,
        default: '',
        schema: {
            type: 'string'
        }
    },
    password: {
        type: 'string',
        name: '密码',
        comment: '密码',
        length: 200,
        default: '',
        schema: {
            type: 'string'
        }
    },
    nickname: {
        type: 'string',
        name: '昵称',
        comment: '昵称',
        length: 200,
        default: '',
        schema: {
            type: 'string'
        }
    },
    phone: {
        type: 'string',
        name: '手机号',
        comment: '手机号',
        length: 20,
        default: '',
        schema: {
            type: 'string'
        }
    },
    weixin: {
        type: 'string',
        name: '微信号',
        comment: '微信号',
        length: 30,
        default: '',
        schema: {
            type: 'string'
        }
    },
    qq: {
        type: 'string',
        name: '微信号',
        comment: '微信号',
        length: 30,
        default: '',
        schema: {
            type: 'string'
        }
    },
    email: {
        type: 'string',
        name: '邮箱',
        comment: '邮箱',
        length: 50,
        default: '',
        schema: {
            type: 'string'
        }
    },
    avatar: {
        type: 'string',
        name: '头像',
        comment: '头像',
        length: 300,
        default: '',
        schema: {
            type: 'string'
        }
    },
    is_system: {
        type: 'tinyint',
        name: '是否系统账号',
        comment: '是否系统账号',
        length: 1,
        default: 0,
        schema: {
            type: 'integer'
        }
    }
};
