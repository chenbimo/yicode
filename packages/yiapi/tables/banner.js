export default {
    _meta: {
        name: '系统轮播图表'
    },
    title: {
        type: 'string',
        comment: '标题',
        length: 100,
        default: ''
    },
    link: {
        type: 'string',
        comment: '跳转地址',
        length: 500,
        default: ''
    },
    thumbnail: {
        type: 'string',
        comment: '缩略图',
        length: 300,
        default: ''
    },
    views: {
        type: 'bigint',
        comment: '浏览人数',
        default: 0
    },
    is_link: {
        type: 'tinyint',
        comment: '是否跳转',
        length: 1,
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
