export const tableName = '系统字典表';
export const tableData = {
    category_id: {
        name: '分类ID',
        field: {
            type: 'bigInt',
            default: 0,
            isIndex: true
        },
        schema: {
            type: 'integer'
        }
    },
    category_code: {
        name: '分类编码',
        field: {
            type: 'string',
            default: '',
            isIndex: true
        },
        schema: {
            type: 'string',
            max: 50,
            pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
        }
    },
    code: {
        name: '字典编码',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 50,
            pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
        }
    },
    name: {
        name: '字典名称',
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
        name: '字典值',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 1000
        }
    },
    symbol: {
        name: '数字类型或字符串类型',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            enum: ['string', 'number']
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
    is_system: {
        name: '是否系统数据（不可删除）',
        field: {
            type: 'tinyInt',
            default: 0
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    }
};
