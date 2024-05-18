import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { menuConfig: importConfig } = await fnImportAppConfig('menu', {});

export const menuConfig = Object.assign(importConfig, {
    '/home': {
        name: '首页数据',
        sort: 1,
        is_system: 1,
        children: {
            '/internal/home': {
                name: '首页',
                is_system: 1,
                sort: 1
            }
        }
    },
    '/banner': {
        name: '轮播管理',
        sort: 1000,
        is_system: 1,
        children: {
            '/internal/banner': {
                name: '轮播列表',
                is_system: 1,
                sort: 1
            }
        }
    },
    '/people': {
        name: '人员数据',
        sort: 1001,
        is_system: 1,
        children: {
            '/internal/user': {
                name: '用户',
                is_system: 1,
                sort: 1
            },
            '/internal/admin': {
                name: '管理员',
                is_system: 1,
                sort: 2
            }
        }
    },
    '/permission': {
        name: '权限数据',
        sort: 1002,
        children: {
            '/internal/menu': {
                name: '菜单列表',
                is_system: 1,
                sort: 1
            },
            '/internal/api': {
                name: '接口列表',
                is_system: 1,
                sort: 2
            },
            '/internal/dictCategory': {
                name: '字典分类',
                is_system: 1,
                sort: 3
            },
            '/internal/dict': {
                name: '字典管理',
                is_system: 1,
                sort: 4
            },
            '/internal/role': {
                name: '角色管理',
                is_system: 1,
                sort: 5
            }
        }
    },
    '/setup': {
        name: '配置数据',
        sort: 1003,
        children: {
            '/internal/app-config': {
                name: '项目配置',
                is_system: 1,
                sort: 1
            }
        }
    },
    '/log': {
        name: '日志数据',
        sort: 1004,
        children: {
            '/internal/login-log': {
                name: '登录日志',
                is_system: 1,
                sort: 1
            },
            '/internal/mail-log': {
                name: '邮件日志',
                is_system: 1,
                sort: 2
            }
        }
    }
});
