export const tableSchemaSchema = {
    title: '协议字段',
    type: 'object',
    properties: {
        string: {
            title: '字符串',
            type: 'array',
            enum: ['type', 'default', 'min', 'max', 'enum', 'pattern'],
            required: ['type', 'default', 'min', 'max', 'enum', 'pattern']
        },
        integer: {
            title: '整数',
            type: 'array',
            enum: ['type', 'default', 'min', 'max', 'multipleOf'],
            required: ['type', 'default', 'min', 'max', 'multipleOf']
        },
        number: {
            title: '数字',
            type: 'array',
            enum: ['type', 'default', 'min', 'max', 'multipleOf'],
            required: ['type', 'default', 'min', 'max', 'multipleOf']
        },
        array: {
            title: '数组',
            type: 'array',
            enum: ['type', 'default', 'items', 'isUniqueItems', 'isAdditionalItems'],
            required: ['type', 'default', 'items', 'isUniqueItems', 'isAdditionalItems']
        }
    }
};
