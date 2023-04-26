export default {
    _meta: {
        name: '系统菜单表'
    },
    pid: {
        type: 'bigint',
        comment: '父级ID',
        default: 0
    },
    pids: {
        type: 'string',
        comment: '父级ID链',
        length: 2000,
        default: '0'
    },
    level: {
        type: 'tinyint',
        comment: '目录层级',
        default: 1
    },
    icon: {
        type: 'string',
        comment: '菜单图标',
        length: 300,
        default: ''
    },
    name: {
        type: 'string',
        comment: '名称',
        length: 100,
        default: ''
    },
    value: {
        type: 'string',
        comment: '路由',
        length: 500,
        default: ''
    },
    sort: {
        type: 'bigint',
        comment: '字典排序',
        default: 0
    },
    describe: {
        type: 'string',
        comment: '描述',
        length: 500,
        default: ''
    },
    is_bool: {
        type: 'tinyint',
        comment: '真假树',
        length: 1,
        default: 0
    },
    is_open: {
        type: 'tinyint',
        comment: '是否公开',
        length: 1,
        default: 0
    },
    is_system: {
        type: 'tinyint',
        comment: '是否系统账号（不可删除）',
        length: 1,
        default: 0
    }
};