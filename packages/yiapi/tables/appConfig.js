export const tableName = '项目配置表';
export const tableData = {
    site_name: {
        name: '站点名称',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 100
    },
    site_logo: {
        name: '站点logo',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 300
    },
    site_bei: {
        name: '备案号',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 100
    },
    smtp_host: {
        name: 'SMTP 服务器',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 100
    },
    smtp_port: {
        name: 'SMTP 端口',
        fieldDefault: 0,
        fieldType: 'mediumint',
        schemaType: 'integer'
    },
    smtp_username: {
        name: 'SMTP 用户名',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 50
    },
    smtp_password: {
        name: 'SMTP 密码',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 50
    },
    smtp_from_name: {
        name: '发送者昵称',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 50
    },
    smtp_from_email: {
        name: '发送者邮箱',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 50
    }
};
