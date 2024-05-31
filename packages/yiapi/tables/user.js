import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '系统用户表';
export const tableData = Object.assign(tableExtConfig.sys_user || {}, {
    openid: {
        name: '微信 openid',
        type: 'string',
        default: '',
        isIndex: true,
        max: 100
    },
    agent_id: {
        name: '上级ID',
        type: 'bigInt',
        default: 0,
        isIndex: true,
        min: 0
    },
    from_product: {
        name: '来自产品',
        type: 'string',
        default: '',
        max: 100
    },
    username: {
        name: '用户名',
        type: 'string',
        default: '',
        max: 50
    },
    password: {
        name: '密码',
        type: 'string',
        default: '',
        max: 500
    },
    nickname: {
        name: '昵称',
        type: 'string',
        default: '',
        max: 100
    },
    role: {
        name: '角色',
        type: 'string',
        default: '',
        max: 100
    },
    phone: {
        name: '手机号',
        type: 'string',
        default: '',
        max: 50
    },
    weixin: {
        name: '微信号',
        type: 'string',
        default: '',
        max: 50
    },
    qq: {
        name: 'QQ号',
        type: 'string',
        default: '',
        max: 30
    },
    email: {
        name: '邮箱',
        type: 'string',
        default: '',
        max: 50
    },
    avatar: {
        name: '头像',
        type: 'string',
        default: '',
        max: 500
    },
    bio: {
        name: '签名',
        type: 'string',
        default: '',
        max: 500
    },
    describe: {
        name: '描述',
        type: 'string',
        default: '',
        max: 500
    },
    is_recommend: {
        name: '是否推荐',
        type: 'tinyInt',
        default: 0,
        enum: [0, 1]
    },
    is_top: {
        name: '是否置顶',
        type: 'tinyInt',
        default: 0,
        enum: [0, 1]
    }
});
