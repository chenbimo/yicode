// 字段类型
export const fieldType = {
    // 字符串
    string: {
        type: 'string',
        args: ['length']
    },
    text: {
        type: 'text',
        args: ['text_type']
    },
    bigInteger: {
        type: 'number',
        args: []
    },
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
    integer: {
        type: 'number',
        args: ['length']
    },
    float: {
        type: 'number',
        args: ['precision', 'scale']
    },
    double: {
        type: 'number',
        args: ['precision', 'scale']
    },
    decimal: {
        type: 'number',
        args: ['precision', 'scale']
    }
};
