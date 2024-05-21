// 字段类型
export const dbFieldConfig = {
    // 字符串型
    string: {
        type: 'string',
        args: ['length']
    },
    // 文本型
    mediumText: {
        type: 'text',
        args: []
    },
    text: {
        type: 'text',
        args: []
    },
    bigText: {
        type: 'text',
        args: []
    },
    // 整型
    tinyInt: {
        type: 'number',
        args: ['length']
    },
    smallInt: {
        type: 'number',
        args: []
    },
    mediumInt: {
        type: 'number',
        args: []
    },
    int: {
        type: 'number',
        args: ['length']
    },
    bigInt: {
        type: 'number',
        args: []
    },
    // 浮点型
    float: {
        type: 'float',
        args: ['precision', 'scale']
    },
    // 双精度型
    double: {
        type: 'float',
        args: ['precision', 'scale']
    }
};
