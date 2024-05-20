export const tableName = '系统用户表';
export const tableData = {
    openid: {
        name: '微信 openid',
        field: {
            type: 'string',
            default: '',
            isIndex: true
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    agent_id: {
        name: '上级ID',
        field: {
            type: 'bigInt',
            default: 0,
            isIndex: true
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    from_product: {
        name: '来自产品',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    username: {
        name: '用户名',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 50
        }
    },
    password: {
        name: '密码',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    nickname: {
        name: '昵称',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    role: {
        name: '角色',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    phone: {
        name: '手机号',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 50
        }
    },
    weixin: {
        name: '微信号',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 50
        }
    },
    qq: {
        name: 'QQ号',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 30
        }
    },
    email: {
        name: '邮箱',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 50
        }
    },
    avatar: {
        name: '头像',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    bio: {
        name: '签名',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    describe: {
        name: '描述',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    is_recommend: {
        name: '是否推荐',
        field: {
            type: 'tinyInt',
            default: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    },
    is_top: {
        name: '是否置顶',
        field: {
            type: 'tinyInt',
            default: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    }
};
