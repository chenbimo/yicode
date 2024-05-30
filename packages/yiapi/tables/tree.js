import { tableExtConfig } from '../config/tableExt.js';
export const tableName = '系统目录表';
export const tableData = Object.assign(tableExtConfig.sys_tree || {}, {
    pid: {
        name: '父级ID',
        field: {
            type: 'bigInt',
            default: 0,
            isIndex: true
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    pids: {
        name: '父级ID链',
        field: {
            type: 'string',
            default: '0'
        },
        schema: {
            type: 'string',
            max: 10000
        }
    },
    level: {
        name: '目录层级',
        field: {
            type: 'tinyInt',
            default: 1
        },
        schema: {
            type: 'integer',
            min: 1
        }
    },
    category: {
        name: '分类编码',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100,
            pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
        }
    },
    image: {
        name: '图标',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    name: {
        name: '名称',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    value: {
        name: '值',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    sort: {
        name: '字典排序',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    describe: {
        name: '描述',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    thumbnail: {
        name: '缩略图',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 500
        }
    },
    is_bool: {
        name: '真假树',
        field: {
            type: 'tinyInt',
            default: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    },
    is_open: {
        name: '是否公开',
        field: {
            type: 'tinyInt',
            default: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    },
    is_system: {
        name: '是否系统账号（不可删除）',
        field: {
            type: 'tinyInt',
            default: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    }
});
