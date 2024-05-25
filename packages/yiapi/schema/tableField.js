export const tableFieldSchema = {
    title: '库表字段',
    type: 'object',
    properties: {
        // 字符串型
        string: {
            title: '字符串',
            type: 'array'
        },
        // 文本型
        mediumText: {
            title: '中长文本',
            type: 'array'
        },
        text: {
            title: '普通文本',
            type: 'array'
        },
        bigText: {
            title: '长文本',
            type: 'array'
        },
        // 整型
        tinyInt: {
            title: '微整数',
            type: 'array'
        },
        smallInt: {
            title: '小整数',
            type: 'array'
        },
        mediumInt: {
            title: '中整数',
            type: 'array'
        },
        int: {
            title: '普通整数',
            type: 'array'
        },
        bigInt: {
            title: '大整数',
            type: 'array'
        },
        // 浮点型
        float: {
            title: '浮点数',
            type: 'array'
        },
        // 双精度型
        double: {
            title: '双精度',
            type: 'array'
        }
    },
    additionalProperties: false
};
