export const tableSchemaSchema = {
    title: '协议字段',
    type: 'object',
    properties: {
        string: {
            title: '字符串',
            type: 'array'
        },
        integer: {
            title: '整数',
            type: 'array'
        },
        number: {
            title: '数字',
            type: 'array'
        },
        array: {
            title: '数组',
            type: 'array'
        }
    }
};
