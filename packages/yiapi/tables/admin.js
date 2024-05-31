import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '系统管理员表';
export const tableData = Object.assign(tableExtConfig.sys_admin || {}, {
    role: {
        name: '角色代号',
        type: 'string',
        default: '',
        min: 1,
        max: 50,
        pattern: '^[a-z][a-z0-9_-]*$'
    },
    role2: {
        name: '角色代号',
        type: 'string',
        default: '',
        min: 1,
        max: 50,
        pattern: '^[a-z][a-z0-9_-]*$'
    },
    username: {
        name: '用户名',
        type: 'string',
        default: '',
        min: 1,
        max: 20,
        pattern: '^[a-z][a-zA-Z0-9_-]*$'
    },
    password: {
        name: '密码',
        type: 'string',
        default: '',
        min: 6,
        max: 300
    },
    nickname: {
        name: '昵称',
        type: 'string',
        default: '',
        min: 1,
        max: 30
    },
    phone: {
        name: '手机号',
        type: 'string',
        default: '',
        min: 1,
        max: 30
    },
    weixin: {
        name: '微信号',
        type: 'string',
        default: '',
        min: 6,
        max: 30,
        pattern: '^[a-zA-Z][-_a-zA-Z0-9]{5,30}$'
    },
    qq: {
        name: 'QQ号',
        type: 'string',
        default: '',
        min: 5,
        max: 20,
        pattern: '^\\d{5,}$'
    },
    email: {
        name: '邮箱',
        type: 'string',
        default: '',
        min: 5,
        max: 50,
        pattern: '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$'
    },
    avatar: {
        name: '头像',
        type: 'string',
        default: '',
        min: 0,
        max: 300
    },
    is_system: {
        name: '是否系统数据（不可删除）',
        type: 'tinyInt',
        default: 0,
        enum: [0, 1]
    }
});
