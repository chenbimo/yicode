export default {
    name: '邮件日志',
    fields: {
        login_email: {
            name: '登录邮箱',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 50
        },
        from_name: {
            name: '发送者昵称',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 50
        },
        from_email: {
            name: '发送者邮箱',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 50
        },
        to_email: {
            name: '接收者邮箱',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 5000
        },
        email_type: {
            name: '邮件类型',
            fieldDefault: 'common',
            fieldType: 'string',
            schemaType: 'string',
            enum: ['common', 'verify']
        },
        email_code: {
            name: '邮件识别码',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            enum: ['loginVerifyCode', 'bindMailVerifyCode', 'setupPasswordVerifyCode']
        },
        text_content: {
            name: '发送内容',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 10000
        }
    }
};
