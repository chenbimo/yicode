// 字段类型
export const fieldType = {
    bigint: {
        type: 'number',
        options: ['unsigned']
    },
    string: {
        type: 'string',
        options: ['length']
    },
    tinyint: {
        type: 'number',
        options: ['length', 'unsigned']
    },
    smallint: {
        type: 'number',
        options: ['unsigned']
    },
    mediumint: {
        type: 'number',
        options: ['unsigned']
    },
    text: {
        type: 'text',
        options: ['text_type', 'nullable']
    },
    float: {
        type: 'float',
        options: ['precision', 'scale', 'unsigned']
    },
    double: {
        type: 'float',
        options: ['precision', 'scale', 'unsigned']
    },
    decimal: {
        type: 'float',
        options: ['precision', 'scale', 'unsigned']
    },
    boolean: {
        type: 'bool',
        options: []
    },
    date: {
        type: 'date',
        options: []
    },
    datetime: {
        type: 'date',
        options: ['precision']
    },
    time: {
        type: 'date',
        options: ['precision']
    },
    binary: {
        type: 'binary',
        options: ['length']
    },
    enu: {
        type: 'enum',
        options: []
    },
    json: {
        type: 'json',
        options: []
    },
    jsonb: {
        type: 'json',
        options: []
    },
    uuid: {
        type: 'uuid',
        options: []
    },
    geometry: {
        type: 'geo',
        options: []
    },
    geography: {
        type: 'geo',
        options: []
    },
    point: {
        type: 'geo',
        options: []
    }
};
