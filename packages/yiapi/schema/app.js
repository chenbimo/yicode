export const appSchema = {
    title: '应用基本配置',
    type: 'object',
    properties: {
        appName: {
            title: '应用名称',
            type: 'string',
            minLength: 1,
            maxLength: 50
        },
        appNameEn: {
            title: '应用英文名称',
            type: 'string',
            minLength: 1,
            maxLength: 50
        },
        salt: {
            title: '加密盐值',
            type: 'string',
            minLength: 1,
            maxLength: 300
        },
        port: {
            title: '监听端口',
            type: 'integer',
            minimum: 0
        },
        host: {
            title: '监听主机',
            type: 'string',
            minLength: 1,
            maxLength: 30
        },
        devPassword: {
            title: '开发者密码',
            type: 'string',
            minLength: 6,
            maxLength: 20
        },
        paramsCheck: {
            title: '接口参数验证',
            type: 'boolean',
            default: false
        },
        isSwagger: {
            title: '是否开启接口文档',
            type: 'boolean',
            default: false
        },
        isWxPay: {
            title: '是否开启支付功能',
            type: 'boolean',
            default: false
        },
        // 数据库表主键方案
        tablePrimaryKey: {
            title: '数据库表主键方案',
            type: 'string',
            enum: ['default', 'time']
        }
    }
};
