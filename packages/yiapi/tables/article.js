export default {
    _meta: {
        name: '系统文章表'
    },
    title: {
        type: 'string',
        comment: '文章标题',
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
    is_top: {
        type: 'tinyint',
        comment: '是否置顶',
        length: 1,
        default: 0
    },
    is_recommend: {
        type: 'tinyint',
        comment: '是否推荐',
        length: 1,
        default: 0
    }
};
