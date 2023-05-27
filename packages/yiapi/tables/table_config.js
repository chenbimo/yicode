export const tableSchema = {
    name: '应用表定义',
    fields: {
        name: {
            type: 'string',
            comment: '表名称',
            length: 50,
            default: ''
        },
        code: {
            type: 'string',
            comment: '表编码',
            length: 50,
            default: '',
            options: ['unique']
        },

        value: {
            type: 'string',
            comment: '表字段',
            length: 10000,
            default: ''
        },
        sort: {
            type: 'bigint',
            comment: '排序',
            default: 0
        },
        describe: {
            type: 'string',
            comment: '描述',
            length: 500,
            default: ''
        }
    }
};
