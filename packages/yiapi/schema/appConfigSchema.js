export const appConfigSchema = {
    type: 'object',
    properties: {
        appName: {
            title: '应用名称',
            type: 'string'
        },
        appNameEn: {
            title: '应用英文名称',
            type: 'string'
        },
        salt: {
            title: '加密盐值',
            type: 'string'
        },
        port: {
            title: '监听端口',
            type: 'number'
        },
        devPassword: {
            title: '开发者密码',
            type: 'string'
        },
        paramsCheck: {
            title: '接口参数验证',
            type: 'boolean'
        },
        // 日志字段过滤，不打印
        logFilter: {
            title: '日志字段过滤',
            type: 'array',
            items: {
                type: 'string'
            },
            uniqueItems: true
        },
        // 任何情况下可以访问的路由
        freeApis: {
            title: '自由接口',
            type: 'array',
            items: {
                type: 'string'
            },
            uniqueItems: true
        },
        // 黑名单接口，不可访问的接口
        blackApis: {
            title: '黑名单接口',
            type: 'array',
            items: {
                type: 'string'
            },
            uniqueItems: true
        },
        // 白名单接口，登录后访问无限制
        whiteApis: {
            title: '白名单接口',
            type: 'array',
            items: {
                type: 'string'
            },
            uniqueItems: true
        },
        // 黑名单菜单
        blackMenus: {
            title: '黑名单菜单',
            type: 'array',
            items: {
                type: 'string'
            },
            uniqueItems: true
        },
        // 数据库配置
        database: {
            title: '数据库配合',
            type: 'object',
            properties: {
                db: {
                    title: '数据库名称',
                    type: 'string'
                },
                username: {
                    title: '用户名',
                    type: 'string'
                },
                password: {
                    title: '密码',
                    type: 'string'
                },
                host: {
                    title: '主机地址',
                    type: 'string'
                },
                port: {
                    title: '监听端口',
                    type: 'number'
                }
            },
            required: [
                //
                'db',
                'username',
                'password',
                'host',
                'port'
            ]
        },
        // redis配置
        redis: {
            title: '缓存配置',
            type: 'object',
            properties: {
                keyPrefix: {
                    title: '缓存前缀',
                    type: 'string'
                },
                username: {
                    title: '用户名',
                    type: 'string'
                },
                password: {
                    title: '连接密码',
                    type: 'string'
                },
                host: {
                    title: '主机地址',
                    type: 'string'
                },
                port: {
                    title: '监听端口',
                    type: 'number'
                }
            },
            required: [
                //
                'keyPrefix',
                'username',
                'password',
                'host',
                'port'
            ]
        },
        // jwt配置
        jwt: {
            title: 'jwt配置',
            type: 'object',
            properties: {
                secret: {
                    title: '加密字符',
                    type: 'string'
                },
                expiresIn: {
                    title: '过期时间',
                    type: 'string'
                }
            },
            required: [
                //
                'secret',
                'expiresIn'
            ]
        },
        // 邮件配置
        mail: {
            title: '邮件配置',
            type: 'object',
            properties: {
                host: {
                    title: '主机地址',
                    type: 'string'
                },
                port: {
                    title: '端口',
                    type: 'number'
                },
                pool: {
                    title: '是否开启连接池',
                    type: 'boolean'
                },
                secure: {
                    title: '是否开启https',
                    type: 'boolean'
                },
                user: {
                    title: '账号',
                    type: 'string'
                },
                pass: {
                    title: '密码',
                    type: 'string'
                }
            },
            required: [
                //
                'host',
                'port',
                'pool',
                'secure',
                'user',
                'pass'
            ],
            from: {
                title: '发件人',
                type: 'object',
                properties: {
                    name: {
                        title: '发件人名称',
                        type: 'string'
                    },
                    address: {
                        title: '发件人地址',
                        type: 'string'
                    }
                },
                required: [
                    //
                    'name',
                    'address'
                ]
            }
        },
        upload: {
            title: '上传配置',
            type: 'object',
            properties: {
                dir: {
                    type: 'string'
                }
            },
            required: ['dir']
        },
        rate: {
            title: '请求频率',
            type: 'object',
            properties: {
                global: {
                    type: 'boolean',
                    title: '是否影响全部的路由'
                },
                max: {
                    type: 'number',
                    title: '限制时间内的最大请求数'
                },
                timeWindow: {
                    type: 'number',
                    title: '限制时间'
                },
                hook: {
                    type: 'string',
                    title: '触发的钩子'
                },
                cache: {
                    type: 'number',
                    title: '内存缓存大小'
                },
                allowList: {
                    type: 'array',
                    title: '白名单'
                }
            },
            required: ['dir']
        }
    },
    required: [
        //
        'appName',
        'appNameEn',
        'salt',
        'port',
        'devPassword',
        'logFilter',
        'freeApis',
        'blackApis',
        'whiteApis',
        'blackMenus',
        'database',
        'redis',
        'jwt',
        'mail',
        'upload'
    ],
    additionalProperties: false
};
