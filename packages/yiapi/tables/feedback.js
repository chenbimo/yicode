export default {
    _meta: {
        name: '系统反馈表'
    },
    ask_id: {
        type: 'bigint',
        comment: '反馈人',
        default: 0
    },
    reply_id: {
        type: 'bigint',
        comment: '回复人',
        default: 0
    },
    question: {
        type: 'string',
        comment: '反馈内容',
        length: 2000,
        default: ''
    },
    answer: {
        type: 'string',
        comment: '回复信息',
        length: 2000,
        default: ''
    }
};
