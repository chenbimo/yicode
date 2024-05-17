export const tableExtSchema = {
    // 扩展系统表字段
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
};
