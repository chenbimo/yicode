export const menuSchema = {
    title: '菜单字段',
    type: 'object',
    patternProperties: {
        '^\\/[a-z][a-z0-9_\\/-]*$': {
            title: '主菜单',
            type: 'object',
            properties: {
                name: {
                    title: '菜单名称',
                    type: 'string'
                },
                is_system: {
                    title: '是否系统菜单',
                    type: 'integer',
                    enum: [0, 1]
                },
                sort: {
                    title: '菜单排序',
                    type: 'integer',
                    minimum: 1,
                    maximum: 9999
                },
                children: {
                    title: '子菜单',
                    type: 'object',
                    properties: {
                        '*': {
                            type: 'object',
                            properties: {
                                name: {
                                    title: '菜单名称',
                                    type: 'string'
                                },
                                sort: {
                                    title: '菜单排序',
                                    type: 'integer',
                                    minimum: 1,
                                    maximum: 9999
                                },
                                is_system: {
                                    title: '是否系统菜单',
                                    type: 'integer',
                                    enum: [0, 1]
                                }
                            },
                            additionalProperties: false,
                            required: ['name', 'sort', 'children']
                        }
                    }
                }
            },
            additionalProperties: false,
            required: ['name', 'sort', 'children']
        }
    }
};
