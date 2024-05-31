import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '登录日志表';
export const tableData = Object.assign(tableExtConfig.sys_login_log || {}, {
    username: {
        name: '用户名',
        type: 'string',
        default: '',
        max: 30
    },
    nickname: {
        name: '昵称',
        type: 'string',
        default: '',
        max: 50
    },
    role: {
        name: '角色',
        type: 'string',
        default: '',
        max: 50
    },
    ip: {
        name: 'ip',
        type: 'string',
        default: '',
        max: 30
    },
    ua: {
        name: 'ua',
        type: 'string',
        default: '',
        max: 500
    }
});
