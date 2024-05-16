export const tableData = {
    _name: '系统管理员表',
    role_codes: {
        name: '角色代号',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 0,
        maxLength: 2000
    },
    username: {
        name: '用户名',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 1,
        maxLength: 20,
        pattern: '^[a-z][a-zA-Z0-9_-]*$'
    },
    password: {
        name: '密码',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 6,
        maxLength: 300,
        pattern: '^[a-zA-Z0-9_-]{6,}$'
    },
    nickname: {
        name: '昵称',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 1,
        maxLength: 30
    },
    phone: {
        name: '手机号',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 6,
        maxLength: 20
    },
    weixin: {
        name: '微信号',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 6,
        maxLength: 30,
        pattern: '^[a-zA-Z][-_a-zA-Z0-9]{5,30}$'
    },
    qq: {
        name: 'QQ号',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 5,
        maxLength: 20,
        pattern: '^\\d{5,}$'
    },
    email: {
        name: '邮箱',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 5,
        maxLength: 50,
        pattern: '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$'
    },
    avatar: {
        name: '头像',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        minLength: 0,
        maxLength: 300
    },
    is_system: {
        name: '是否系统数据（不可删除）',
        fieldDefault: 0,
        fieldType: 'tinyint',
        schemaType: 'integer',
        enum: [0, 1]
    }
};
