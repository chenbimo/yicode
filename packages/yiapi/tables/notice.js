export default {
    _meta: {
        name: '系统通知表'
    },
    publisher_id: {
        type: 'bigint',
        comment: '发布者ID',
        default: 0
    },
    title: {
        type: 'string',
        comment: '标题',
        length: 100,
        default: ''
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
    views: {
        type: 'bigint',
        comment: '浏览人数',
        default: 0
    },
    is_recommend: {
        type: 'tinyint',
        comment: '是否推荐',
        length: 1,
        default: 0
    }
};
