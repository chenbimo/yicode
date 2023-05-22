export default {
    _meta: {
        name: '系统字典分类表'
    },
    code: {
        type: 'string',
        comment: '字典分类编码',
        length: 50,
        default: ''
    },
    name: {
        type: 'string',
        comment: '字典分类名称',
        length: 100,
        default: ''
    },
    sort: {
        type: 'bigint',
        comment: '字典分类排序',
        default: 0
    },
    describe: {
        type: 'string',
        comment: '描述',
        length: 500,
        default: ''
    }
};
