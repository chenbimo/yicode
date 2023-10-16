// 字段类型
export let fieldType = {
    // 字符串
    string: {
        type: 'string',
        args: ['length']
    },
    text: {
        type: 'text',
        args: ['capacity']
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
        type: 'float',
        args: ['precision', 'scale']
    },
    double: {
        type: 'float',
        args: ['precision', 'scale']
    }
};
