export const tableName = '演示表';
export const tableData = {
    nickname: {
        name: '用户名',
        type: 'string',
        default: '',
        min: 1,
        max: 50
    },
    age: {
        name: '年龄',
        type: 'tinyInt',
        default: 18,
        min: 0,
        max: 150
    }
};
