export const callbackSchema = {
    title: '回调函数',
    type: 'object',
    patternProperties: {
        '^[a-z][a-z0-9_-]*$': {
            title: '任意字段',
            type: 'object'
        }
    }
};
