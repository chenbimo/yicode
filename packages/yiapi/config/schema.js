// 字符串长度枚举
let stringEnum = [
    //
    1, 2, 3, 4, 5, 6, 7, 8, 9,
    //
    10, 20, 30, 40, 50, 60, 70, 80, 90,
    //
    100, 200, 300, 400, 500, 600, 700, 800, 900,
    //
    1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
    //
    10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000
];
let schemaConfig = {
    // 主键 ID
    id: {
        type: 'integer',
        minimum: 1
    },
    // 主键 ID
    pid: {
        type: 'integer',
        minimum: 0,
        maximum: 18446744073709551615
    },
    // 最小数字为 1
    min1: {
        type: 'integer',
        minimum: 1,
        maximum: 18446744073709551615
    },
    // 最小数字为 0
    min0: {
        type: 'integer',
        minimum: 0
    },
    // 唯一 ID
    uuid: {
        type: 'string',
        minLength: 10,
        maxLength: 100
    },
    // 第几页
    page: {
        type: 'integer',
        minimum: 1,
        default: 1
    },
    // 每页数量
    limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 20
    },
    // 布尔值
    boolEnum: {
        type: 'integer',
        enum: [0, 1]
    },
    // 状态 (0 正常，1 禁用，2 删除)
    state: {
        type: 'integer',
        enum: [0, 1, 2]
    },
    // 搜索关键字
    keywords: {
        type: 'string',
        minLength: 0,
        maxLength: 100
    },
    // 分类代号
    category: {
        type: 'string',
        minLength: 0,
        maxLength: 30,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    // 编码代号
    code: {
        type: 'string',
        minLength: 0,
        maxLength: 20,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    // 标题
    title: {
        type: 'string',
        minLength: 0,
        maxLength: 100
    },
    // 描述
    describe: {
        type: 'string',
        minLength: 0,
        maxLength: 500
    },
    // 正文
    content: {
        type: 'string',
        minLength: 0,
        maxLength: 65535
    },
    // 图片
    image: {
        type: 'string',
        minLength: 0,
        maxLength: 300
    },
    // 图片列表
    image_lists: {
        type: 'string',
        minLength: 0,
        maxLength: 5000
    },
    // 账号
    account: {
        type: 'string',
        minLength: 0,
        maxLength: 30
    },
    // 角色码组
    role_codes: {
        type: 'string',
        minLength: 1,
        maxLength: 2000
    },
    // 用户名
    username: {
        type: 'string',
        minLength: 1,
        maxLength: 20,
        pattern: '^[a-zA-Z_-][a-zA-Z0-9_-]*$'
    },
    // 密码
    password: {
        type: 'string',
        minLength: 6,
        maxLength: 300
    },
    // 昵称
    nickname: {
        type: 'string',
        minLength: 1,
        maxLength: 30
    },
    // 手机号
    phone: {
        type: 'string',
        minLength: 11,
        maxLength: 20
        // pattern: '^(?:(?:+|00)86)?1[3-9]d{9}$',
        // pattern: '^(?:(?:+|00)86)?1d{10}$'
    },
    // 微信号
    weixin: {
        type: 'string',
        minLength: 6,
        maxLength: 30,
        pattern: '^[a-zA-Z][-_a-zA-Z0-9]{5,19}$'
    },
    // QQ 号
    qq: {
        type: 'string',
        minLength: 5,
        maxLength: 20,
        pattern: '^[1-9][0-9]{4,11}$'
    },
    // 邮箱
    email: {
        type: 'string',
        minLength: 3,
        maxLength: 30,
        pattren: '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$'
    },
    // 经度
    longitude: {
        type: 'string',
        minLength: 1,
        maxLength: 30
    },
    // 纬度
    latitude: {
        type: 'string',
        minLength: 1,
        maxLength: 30
    }
};

// 字符串内置字段
stringEnum.forEach((num) => {
    schemaConfig[`string0to${num}`] = {
        type: 'string',
        minLength: 0,
        maxLength: num
    };
    schemaConfig[`string1to${num}`] = {
        type: 'string',
        minLength: 1,
        maxLength: num
    };
});

export { schemaConfig };
