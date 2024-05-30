import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '项目配置表';
export const tableData = Object.assign(tableExtConfig.sys_app_config || {}, {
    site_name: {
        name: '站点名称',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    site_logo: {
        name: '站点logo',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 300
        }
    },
    site_bei: {
        name: '备案号',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    smtp_host: {
        name: 'SMTP 服务器',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 200
        }
    },
    smtp_port: {
        name: 'SMTP 端口',
        field: {
            type: 'mediumInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    smtp_username: {
        name: 'SMTP 用户名',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    smtp_password: {
        name: 'SMTP 密码',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    smtp_from_name: {
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
    smtp_from_email: {
        name: '发送者邮箱',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    }
});
