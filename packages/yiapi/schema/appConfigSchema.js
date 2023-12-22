export const appConfigSchema = {
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
            type: 'integer'
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
        // 数据库表主键方案
        tablePrimaryKey: {
            title: '数据库表主键方案',
            type: 'string',
            enum: ['default', 'time']
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
            additionalProperties: false,
            required: [
                //
                'db',
                'username',
                'password',
                'host',
                'port'
            ]
        },
        // redis 配置
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
                db: {
                    title: '库序号',
                    type: 'number'
                },
                port: {
                    title: '监听端口',
                    type: 'number'
                }
            },
            additionalProperties: false,
            required: [
                //
                'keyPrefix',
                'username',
                'password',
                'db',
                'host',
                'port'
            ]
        },
        // jwt 配置
        jwt: {
            title: 'jwt 配置',
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
            additionalProperties: false,
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
                    title: '是否开启 https',
                    type: 'boolean'
                },
                user: {
                    title: '账号',
                    type: 'string'
                },
                pass: {
                    title: '密码',
                    type: 'string'
                },
                from_user: {
                    title: '发送者昵称',
                    type: 'string'
                },
                from_email: {
                    title: '发送者邮箱',
                    type: 'string'
                }
            },
            additionalProperties: false,
            required: [
                //
                'host',
                'port',
                'pool',
                'secure',
                'user',
                'pass',
                'from_user',
                'from_email'
            ]
        },
        // 文件上传
        upload: {
            title: '上传配置',
            type: 'object',
            properties: {
                dir: {
                    type: 'string'
                }
            },
            additionalProperties: false,
            required: ['dir']
        },
        // 请求限速
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
            additionalProperties: false
        },
        // 定时器配置
        cron: {
            title: '定时器',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    timer: {
                        title: '定时器',
                        type: 'string'
                    },
                    name: {
                        title: '定时器名称',
                        type: 'string'
                    },
                    code: {
                        title: '定时器代号',
                        type: 'string'
                    },
                    maxRuns: {
                        title: '最大运行次数',
                        type: 'number'
                    },
                    timezone: {
                        title: '时区',
                        type: 'string'
                    },
                    handler: {
                        title: '处理函数'
                    }
                },
                additionalProperties: false,
                required: ['timer', 'handler', 'name', 'code']
            }
        },
        // 扩展系统表字段
        table: {
            title: '系统表扩展字段',
            type: 'object',
            properties: {
                sys_admin: {
                    title: '系统管理表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                },
                sys_api: {
                    title: '系统接口表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                },
                sys_app_config: {
                    title: '系统配置表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                },
                sys_dict_category: {
                    title: '系统字典分类表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                },
                sys_dict: {
                    title: '系统字典表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                },
                sys_login_log: {
                    title: '系统登录日志表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                },
                sys_mail_log: {
                    title: '系统邮件日志表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                },
                sys_menu: {
                    title: '系统菜单表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                },
                sys_role: {
                    title: '系统角色表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                },
                sys_user: {
                    title: '系统用户表',
                    type: 'object',
                    properties: {
                        '*': {
                            title: '任意字段',
                            type: 'object',
                            properties: {}
                        }
                    }
                }
            }
        },
        // 扩展菜单字段
        menu: {
            title: '扩展菜单字段',
            type: 'object',
            properties: {
                '*': {
                    title: '主菜单',
                    type: 'object',
                    properties: {
                        name: {
                            title: '菜单名称',
                            type: 'string'
                        },
                        is_system: {
                            title: '是否系统菜单',
                            type: 'integer',
                            enum: [0, 1]
                        },
                        sort: {
                            title: '菜单排序',
                            type: 'integer',
                            minimum: 1,
                            maximum: 999
                        },
                        children: {
                            title: '子菜单',
                            type: 'object',
                            properties: {
                                '*': {
                                    type: 'object',
                                    properties: {
                                        name: {
                                            title: '菜单名称',
                                            type: 'string'
                                        },
                                        sort: {
                                            title: '菜单排序',
                                            type: 'integer',
                                            minimum: 1,
                                            maximum: 999
                                        },
                                        is_system: {
                                            title: '是否系统菜单',
                                            type: 'integer',
                                            enum: [0, 1]
                                        }
                                    },
                                    additionalProperties: false,
                                    required: ['name', 'sort', 'children']
                                }
                            }
                        }
                    },
                    additionalProperties: false,
                    required: ['name', 'sort', 'children']
                }
            }
        },
        weixin: {
            title: '微信配置',
            type: 'object',
            properties: {
                // 商户配置
                mchId: {
                    title: '商户号',
                    type: 'string'
                },
                serialNo: {
                    title: '支付序列号',
                    type: 'string'
                },
                apiv3PrivateKey: {
                    title: '支付秘钥',
                    type: 'string'
                },
                privateKey: {
                    title: '商户私钥',
                    type: 'string'
                },
                // 公众号配置
                // appId
                appId: {
                    title: '公众号appId',
                    type: 'string'
                },
                // appSecret
                appSecret: {
                    title: '公众号密钥',
                    type: 'string'
                },
                // 支付回调地址
                notifyUrl: {
                    title: '支付通知地址',
                    type: 'string'
                }
            },
            additionalProperties: false,
            required: ['mchId', 'serialNo', 'apiv3PrivateKey', 'privateKey', 'appId', 'appSecret', 'notifyUrl']
        },
        // 产品配置
        product: {
            title: '产品配置',
            type: 'object',
            properties: {
                '*': {
                    type: 'integer',
                    minimum: 1
                }
            }
        },
        // 支付配置
        payment: {
            title: '支付配置',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    // 产品名称
                    name: {
                        title: '产品名称',
                        type: 'string',
                        minLength: 1,
                        maxLength: 20
                    },
                    // 产品代号
                    product: {
                        title: '产品代号',
                        type: 'integer',
                        minimum: 1
                    },
                    // 支付代号
                    code: {
                        title: '支付代号',
                        type: 'integer',
                        minimum: 1
                    },
                    // 时长 0=永久 非0=秒
                    duration: {
                        title: '购买时间（秒）',
                        type: 'integer',
                        minimum: 0
                    },
                    // 价格 分
                    money: {
                        title: '购买价格（分）',
                        type: 'integer',
                        minimum: 1
                    }
                },
                additionalProperties: false,
                required: ['name', 'product', 'code', 'duration', 'money']
            }
        }
    },
    required: [
        //
        'appName',
        'appNameEn',
        'salt',
        'port',
        'devPassword',
        'paramsCheck',
        'logFilter',
        'isSwagger',
        'freeApis',
        'blackApis',
        'whiteApis',
        'blackMenus',
        'database',
        'redis',
        'jwt',
        'mail',
        'upload',
        'rate',
        'cron',
        'table',
        'menu',
        'weixin',
        'product'
    ],
    additionalProperties: false
};
