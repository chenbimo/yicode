// 系统表字段扩展
export const tableExtConfig = {
    sys_user: {
        test_field: {
            name: '测试字段，此字段不能删除',
            type: 'string',
            default: '',
            min: 1,
            max: 50
        }
    }
};
