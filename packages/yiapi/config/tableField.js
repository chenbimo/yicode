// 表字段定义
export const tableField = {
    phone: {
        comment: '手机号',
        type: 'string',
        length: 20,
        default: ''
    },
    username: {
        comment: '用户名',
        type: 'string',
        length: 20,
        default: ''
    },
    password: {
        comment: '密码',
        type: 'string',
        length: 300,
        default: ''
    },
    image: {
        comment: '图片',
        type: 'string',
        length: 300,
        default: ''
    },
    gender: {
        comment: '性别(1:男,2:女,3:未知)',
        type: 'tinyint',
        length: 1,
        default: 3
    },
    longitude: {
        comment: '经度',
        type: 'string',
        length: 50,
        default: ''
    },
    latitude: {
        comment: '纬度',
        type: 'string',
        length: 50,
        default: ''
    },
    boolEnum: {
        comment: '布尔枚举{0:关,1:开}',
        type: 'tinyint',
        length: 1,
        default: 0
    },
    state: {
        comment: '状态{0:正常,1:禁用,2:删除}',
        type: 'tinyint',
        length: 1,
        default: 0
    },
    content: {
        comment: '正文',
        type: 'text',
        default: ''
    }
};
