export default {
    _meta: {
        name: '资讯表'
    },
    category_id: {
        type: 'bigint',
        comment: '资讯分类',
        default: 0
    },
    title: {
        type: 'string',
        comment: '资讯标题',
        length: 100,
        default: ''
    },
    thumbnail: {
        type: 'string',
        comment: '资讯封面',
        length: 300,
        default: ''
    },
    describe: {
        type: 'string',
        comment: '资讯描述',
        length: 500,
        default: ''
    },
    content: {
        type: 'text',
        comment: '资讯正文'
    }
};
