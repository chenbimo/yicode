export default {
    _meta: {
        name: '系统字典表'
    },
    category_id: {
        type: 'bigint',
        comment: '分类ID',
        default: 0
    },
    category_code: {
        type: 'string',
        comment: '分类编码',
        length: 50,
        default: ''
    },
    code: {
        type: 'string',
        comment: '字典编码',
        length: 50,
        default: ''
    },
    name: {
        type: 'string',
        comment: '字典名称',
        length: 100,
        default: ''
    },
    value: {
        type: 'string',
        comment: '字典值',
        length: 500,
        default: ''
    },
    symbol: {
        type: 'string',
        comment: '数字类型或字符串类型',
        length: 20,
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
    thumbnail: {
        type: 'string',
        comment: '缩略图',
        length: 300,
        default: ''
    },
    content: {
        type: 'text',
        comment: '正文',
        default: ''
    },
    images: {
        type: 'string',
        comment: '图片列表',
        length: 2000,
        default: ''
    },
    is_system: {
        type: 'tinyint',
        comment: '是否系统数据（不可删除）',
        length: 1,
        default: 0
    }
};
