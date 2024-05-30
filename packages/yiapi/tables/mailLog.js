import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '邮件日志表';
export const tableData = Object.assign(tableExtConfig.sys_mail_log || {}, {
    login_email: {
        name: '登录邮箱',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    from_name: {
        name: '发送者昵称',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    from_email: {
        name: '发送者邮箱',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    to_email: {
        name: '接收者邮箱',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 5000
        }
    },
    email_type: {
        name: '邮件类型',
        field: {
            type: 'string',
            default: 'common'
        },
        schema: {
            type: 'string',
            enum: ['common', 'verify']
        }
    },
    email_code: {
        name: '邮件识别码',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            enum: ['loginVerifyCode', 'bindMailVerifyCode', 'setupPasswordVerifyCode']
        }
    },
    text_content: {
        name: '发送内容',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 10000
        }
    }
});
