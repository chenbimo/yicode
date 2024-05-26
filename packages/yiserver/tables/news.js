export const tableName = '演示表';
export const tableData = {
    nickname: {
        name: '用户名',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            min: 1,
            max: 50
        }
    },
    age: {
        name: '年龄',
        field: {
            type: 'tinyInt',
            default: ''
        },
        schema: {
            type: 'integer',
            min: 0,
            max: 150
        }
    }
};
