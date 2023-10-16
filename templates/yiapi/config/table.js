// 系统表字段扩展
let tableConfig = {
    sys_user: {
        test_field: {
            type: 'string',
            comment: '测试字段，此字段不能删除，用来验证自定义字段是否生效，避免同步时误删字段',
            length: 10,
            default: ''
        },
        openid: {
            type: 'string',
            comment: '微信 openid',
            length: 50,
            default: ''
        }
    }
};

export { tableConfig };
