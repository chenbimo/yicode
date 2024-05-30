import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '登录日志表';
export const tableData = Object.assign(tableExtConfig.sys_login_log || {}, {
    username: {
        name: '用户名',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 30
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
            max: 50
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
            max: 50
        }
    },
    ip: {
        name: 'ip',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 30
        }
    },
    ua: {
        name: 'ua',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    }
});
