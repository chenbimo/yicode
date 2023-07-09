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
let schemaField = {
    // 主键 ID
    id: {
        title: '主键ID',
        type: 'integer',
        minimum: 1
    },
    // 主键 ID
    pid: {
        title: '父级ID',
        type: 'integer',
        minimum: 0,
        maximum: 18446744073709551615
    },
    // 最小数字为 1
    min1: {
        title: '最小数字为1',
        type: 'integer',
        minimum: 1,
        maximum: 18446744073709551615
    },
    // 最小数字为 0
    min0: {
        title: '最小数字为0',
        type: 'integer',
        minimum: 0
    },
    // 第几页
    page: {
        title: '第几页',
        type: 'integer',
        minimum: 1,
        default: 1
    },
    // 每页数量
    limit: {
        title: '每页数量',
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 20
    },
    // 布尔值
    boolEnum: {
        title: '布尔值',
        type: 'integer',
        enum: [0, 1]
    },
    // 状态 (0 正常，1 禁用，2 删除)
    state: {
        title: '状态',
        type: 'integer',
        enum: [0, 1, 2]
    },
    // 搜索关键字
    keyword: {
        title: '关键字',
        type: 'string',
        minLength: 0,
        maxLength: 100
    },
    // 小写字母+数字
    a123: {
        title: '小写字母+数字',
        type: 'string',
        minLength: 0,
        maxLength: 50,
        pattern: '^[a-z][a-z0-9]*$'
    },
    // 小写字母+数字+下划线
    a123_: {
        title: '小写字母+数字+下划线',
        type: 'string',
        minLength: 0,
        maxLength: 50,
        pattern: '^[a-z][a-z0-9_]*$'
    },
    // 小写字母+数字+下划线+短横线
    a123_d: {
        title: '小写字母+数字+下划线+短横线',
        type: 'string',
        minLength: 0,
        maxLength: 50,
        pattern: '^[a-z][a-z0-9_-]*$'
    },
    // 大写字母+数字+下划线+短横线
    A123_d: {
        title: '字母+数字+下划线+短横线',
        type: 'string',
        minLength: 0,
        maxLength: 50,
        pattern: '^[A-Z][A-Z0-9_-]*$'
    },
    // 字母+数字+下划线+短横线
    Aa123_d: {
        title: '字母+数字+下划线+短横线',
        type: 'string',
        minLength: 0,
        maxLength: 50,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    // 字母+数字+下划线+斜杠
    Aa123_x: {
        title: '字母+数字+下划线+斜杠',
        type: 'string',
        minLength: 0,
        maxLength: 50,
        pattern: '^/[a-zA-Z][a-zA-Z0-9-\\/]*$'
    },
    // 分类代号
    category: {
        title: '分类编码',
        type: 'string',
        minLength: 0,
        maxLength: 30,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    // 编码代号
    code: {
        title: '编码',
        type: 'string',
        minLength: 0,
        maxLength: 20,
        pattern: '^[a-zA-Z][a-zA-Z0-9_-]*$'
    },
    // 路由
    route: {
        title: '路由',
        type: 'string',
        minLength: 0,
        maxLength: 200,
        pattern: '^/[a-zA-Z][a-zA-Z0-9-\\/]*$'
    },
    // 标题
    title: {
        title: '标题',
        type: 'string',
        minLength: 0,
        maxLength: 100
    },
    // 描述
    describe: {
        title: '描述',
        type: 'string',
        minLength: 0,
        maxLength: 500
    },
    // 正文
    content: {
        title: '正文',
        type: 'string',
        minLength: 0,
        maxLength: 65535
    },
    // 图片
    image: {
        title: '图片',
        type: 'string',
        minLength: 0,
        maxLength: 300
    },
    // 图片列表
    image_lists: {
        title: '图片列表',
        type: 'string',
        minLength: 0,
        maxLength: 5000
    },
    // 账号
    account: {
        title: '账号',
        type: 'string',
        minLength: 1,
        maxLength: 50
    },
    // 角色码组
    role_codes: {
        title: '角色组',
        type: 'string',
        minLength: 1,
        maxLength: 2000
    },
    // 用户名
    username: {
        title: '用户名',
        type: 'string',
        minLength: 1,
        maxLength: 20,
        pattern: '^[a-zA-Z_-][a-zA-Z0-9_-]*$'
    },
    // 密码
    password: {
        title: '密码',
        type: 'string',
        minLength: 6,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_-]{6,}$'
    },
    // 昵称
    nickname: {
        title: '昵称',
        type: 'string',
        minLength: 1,
        maxLength: 30
    },
    // 手机号
    phone: {
        title: '手机号',
        type: 'string',
        minLength: 11,
        maxLength: 20
        // pattern: '^(?:(?:+|00)86)?1[3-9]d{9}$',
        // pattern: '^(?:(?:+|00)86)?1d{10}$'
    },
    // 微信号
    weixin: {
        title: '微信号',
        type: 'string',
        minLength: 6,
        maxLength: 30,
        pattern: '^[a-zA-Z][-_a-zA-Z0-9]{5,19}$'
    },
    // 数据编码
    table_code: {
        title: '表名称',
        type: 'string',
        minLength: 1,
        maxLength: 50,
        // 小写开头 + [下划线|字母|数字]
        pattern: '^[a-z][_a-z0-9]*$'
    },
    // QQ号
    qq: {
        title: 'QQ',
        type: 'string',
        minLength: 5,
        maxLength: 20,
        pattern: '^[1-9][0-9]{4,11}$'
    },
    // 邮箱
    email: {
        title: '邮箱',
        type: 'string',
        minLength: 3,
        maxLength: 30,
        pattern: '^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$'
    },
    // 经度
    longitude: {
        title: '经度',
        type: 'string',
        minLength: 1,
        maxLength: 50
    },
    // 纬度
    latitude: {
        title: '纬度',
        type: 'string',
        minLength: 1,
        maxLength: 50
    }
};

// 字符串内置字段
stringEnum.forEach((num) => {
    schemaField[`string0to${num}`] = {
        type: 'string',
        minLength: 0,
        maxLength: num
    };
    schemaField[`string1to${num}`] = {
        type: 'string',
        minLength: 1,
        maxLength: num
    };
});

export { schemaField };
