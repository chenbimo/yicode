// 表类型字段
const fieldTypeConfig = {
    integer: {
        type: 'number',
        length: true,
        unsigned: true
    },
    bigInteger: {
        type: 'number',
        unsigned: true
    },
    tinyint: {
        type: 'number',
        length: true,
        unsigned: true
    },
    smallint: {
        type: 'number',
        unsigned: true
    },
    mediumint: {
        type: 'number',
        unsigned: true
    },
    bigint: {
        type: 'number',
        unsigned: true
    },
    text: {
        type: 'text',
        text_type: true,
        nullable: true
    },
    string: {
        type: 'string',
        length: true
    },
    float: {
        type: 'float',
        precision: true,
        scale: true,
        unsigned: true
    },
    double: {
        type: 'float',
        precision: true,
        scale: true,
        unsigned: true
    },
    decimal: {
        type: 'float',
        precision: true,
        scale: true,
        unsigned: true
    },
    boolean: {
        type: 'bool'
    },
    date: {
        type: 'date'
    },
    datetime: {
        type: 'date',
        precision: true
    },
    time: {
        type: 'date',
        precision: true
    },
    timestamp: {
        type: 'date',
        precision: true
    },
    timestamps: {
        type: 'date'
    },
    binary: {
        type: 'binary',
        length: true
    },
    enu: {
        type: 'enum'
    },
    json: {
        type: 'json'
    },
    jsonb: {
        type: 'json'
    },
    uuid: {
        type: 'uuid'
    },
    geometry: {
        type: 'geo'
    },
    geography: {
        type: 'geo'
    },
    point: {
        type: 'geo'
    }
};

export { fieldTypeConfig };
