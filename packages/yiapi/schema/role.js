export const roleSchema = {
    title: '角色配置',
    type: 'object',
    patternProperties: {
        '^[a-z][a-z0-9_]*$': {
            title: '角色代号',
            type: 'object',
            properties: {
                name: {
                    title: '角色名称',
                    type: 'string',
                    minLength: 1,
                    maxLength: 20
                },
                describe: {
                    title: '角色描述',
                    type: 'string',
                    minLength: 0,
                    maxLength: 200
                },
                is_system: {
                    title: '是否系统角色',
                    type: 'integer',
                    default: 0,
                    enum: [0, 1]
                }
            },
            additionalProperties: false,
            required: ['name', 'describe']
        }
    }
};
