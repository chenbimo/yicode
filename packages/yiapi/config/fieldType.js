// 字段类型
export const fieldType = {
    // 字符串型
    string: {
        type: 'string',
        args: ['length']
    },
    // 文本型
    smalltext: {
        type: 'text',
        args: []
    },
    mediumtext: {
        type: 'text',
        args: []
    },
    longtext: {
        type: 'text',
        args: []
    },
    // 整型
    tinyint: {
        type: 'number',
        args: ['length']
    },
    smallint: {
        type: 'number',
        args: []
    },
    mediumint: {
        type: 'number',
        args: []
    },
    bigint: {
        type: 'number',
        args: []
    },
    int: {
        type: 'number',
        args: ['length']
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
