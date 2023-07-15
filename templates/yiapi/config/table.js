// 系统表字段扩展
const tableConfig = {
    sys_user: {
        openid: {
            type: 'string',
            comment: '微信 openid',
            length: 50,
            default: ''
        }
    }
};

export { tableConfig };
