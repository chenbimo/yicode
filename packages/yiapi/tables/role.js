export const tableData = {
    _name: '系统角色表',
    code: {
        name: '角色编码',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 50,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    name: {
        name: '角色名称',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 100
    },
    describe: {
        name: '角色描述',
        fieldDefault: '',
        fieldType: 'string',
        schemaType: 'string',
        maxLength: 500
    },
    menu_ids: {
        name: '角色菜单',
        fieldDefault: '',
        schemaDefault: [],
        fieldType: 'mediumtext',
        schemaType: 'array',
        items: 'integer'
    },
    api_ids: {
        name: '角色接口',
        fieldDefault: '',
        schemaDefault: [],
        fieldType: 'mediumtext',
        schemaType: 'array',
        items: 'integer'
    },
    sort: {
        name: '角色排序',
        fieldDefault: 0,
        fieldType: 'bigint',
        schemaType: 'integer',
        minimum: 0
    },
    is_system: {
        name: '是否系统角色（不可删除）',
        fieldDefault: 0,
        fieldType: 'tinyint',
        schemaType: 'integer',
        enum: [0, 1]
    }
};
