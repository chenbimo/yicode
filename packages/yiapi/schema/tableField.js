export const tableFieldSchema = {
    title: '库表字段',
    type: 'object',
    properties: {
        // 字符串型
        string: {
            type: 'array',
            enum: ['type', 'default', 'length', 'isIndex', 'isUnique'],
            required: ['type', 'default', 'length', 'isIndex', 'isUnique']
        },
        // 文本型
        mediumText: {
            type: 'array',
            enum: ['type'],
            required: ['type']
        },
        text: {
            type: 'array',
            enum: ['type'],
            required: ['type']
        },
        bigText: {
            type: 'array',
            enum: ['type'],
            required: ['type']
        },
        // 整型
        tinyInt: {
            type: 'array',
            enum: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
            required: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned']
        },
        smallInt: {
            type: 'array',
            enum: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
            required: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned']
        },
        mediumInt: {
            type: 'array',
            enum: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
            required: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned']
        },
        int: {
            type: 'array',
            enum: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
            required: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned']
        },
        bigInt: {
            type: 'array',
            enum: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned'],
            required: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned']
        },
        // 浮点型
        float: {
            type: 'array',
            enum: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned', 'precision', 'scale'],
            required: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned', 'precision', 'scale']
        },
        // 双精度型
        double: {
            type: 'array',
            enum: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned', 'precision', 'scale'],
            required: ['type', 'default', 'isIndex', 'isUnique', 'isUnsigned', 'precision', 'scale']
        }
    }
};
