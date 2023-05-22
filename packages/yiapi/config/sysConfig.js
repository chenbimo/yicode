import { resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cwd } from 'node:process';

// 系统路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

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
        minLength: 1,
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
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_-]{6,}$'
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
    // QQ号
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

// 表字段定义
let tableField = {
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

// 字段类型
let tableFieldType = {
    integer: {
        type: 'number',
        length: true,
        unsigned: true
    },
    bigInteger: {
        type: 'number',
        unsigned: true
    },
    tinyint: {
        type: 'number',
        length: true,
        unsigned: true
    },
    smallint: {
        type: 'number',
        unsigned: true
    },
    mediumint: {
        type: 'number',
        unsigned: true
    },
    bigint: {
        type: 'number',
        unsigned: true
    },
    text: {
        type: 'text',
        text_type: true,
        nullable: true
    },
    string: {
        type: 'string',
        length: true
    },
    float: {
        type: 'float',
        precision: true,
        scale: true,
        unsigned: true
    },
    double: {
        type: 'float',
        precision: true,
        scale: true,
        unsigned: true
    },
    decimal: {
        type: 'float',
        precision: true,
        scale: true,
        unsigned: true
    },
    boolean: {
        type: 'bool'
    },
    date: {
        type: 'date'
    },
    datetime: {
        type: 'date',
        precision: true
    },
    time: {
        type: 'date',
        precision: true
    },
    timestamp: {
        type: 'date',
        precision: true
    },
    timestamps: {
        type: 'date'
    },
    binary: {
        type: 'binary',
        length: true
    },
    enu: {
        type: 'enum'
    },
    json: {
        type: 'json'
    },
    jsonb: {
        type: 'json'
    },
    uuid: {
        type: 'uuid'
    },
    geometry: {
        type: 'geo'
    },
    geography: {
        type: 'geo'
    },
    point: {
        type: 'geo'
    }
};

// 参数类型
let schemaFieldType = [
    //
    'json',
    'string',
    'number',
    'integer',
    'object',
    'array',
    'boolean',
    'null'
];

export const sysConfig = {
    appDir: cwd(),
    yiapiDir: __dirname,
    // 内置表字段定义
    tableFieldType: tableFieldType,
    tableField: tableField,
    schemaField: schemaField,
    schemaFieldType: schemaFieldType
};
