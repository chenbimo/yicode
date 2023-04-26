import path from 'node:path';
import { forOwn as _forOwn, values as _values } from 'lodash-es';
import { merge as mergeAny } from 'merge-anything';

import { fnFileProtocolPath, fnImport, fnMergeArray } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'menu.js'));
let { menuConfig: importConfig } = await fnImport(configPath, 'menuConfig', {});

const menuConfig = mergeAny(
    {
        '/home-data': {
            name: '首页数据',
            describe: '首页数据',
            sort: 1,
            children: {
                '/': {
                    name: '首页',
                    sort: 1
                }
            }
        },
        '/people-data': {
            name: '人员数据',
            describe: '人员数据',
            sort: 2,
            children: {
                '/user': {
                    name: '用户',
                    describe: '用户列表',
                    sort: 1
                },
                '/admin': {
                    name: '管理员',
                    describe: '管理员列表',
                    sort: 2
                }
            }
        },
        '/notice-banner': {
            name: '公告轮播',
            describe: '公告轮播',
            sort: 3,
            children: {
                '/notice': {
                    name: '公告',
                    describe: '公告列表',
                    sort: 1
                },
                '/banner': {
                    name: '轮播图',
                    describe: '轮播图列表',
                    sort: 2
                }
            }
        },
        '/news-article': {
            name: '资讯文章',
            describe: '资讯文章',
            sort: 4,
            children: {
                '/news': {
                    name: '资讯',
                    describe: '资讯列表',
                    sort: 1
                }
            }
        },
        '/feedback-suggestion': {
            name: '反馈建议',
            describe: '反馈建议',
            sort: 5,
            children: {
                '/feedback': {
                    name: '反馈',
                    describe: '反馈列表',
                    sort: 1
                }
            }
        },
        '/permission-data': {
            name: '权限数据',
            describe: '权限数据',
            sort: 6,
            children: {
                '/menu': {
                    name: '菜单',
                    describe: '菜单列表',
                    sort: 1
                },
                '/api': {
                    name: '接口',
                    describe: '接口列表',
                    sort: 2
                },
                '/dictionary': {
                    name: '字典',
                    describe: '字典列表',
                    sort: 3
                },
                '/role': {
                    name: '角色',
                    describe: '角色列表',
                    sort: 4
                }
            }
        }
    },
    importConfig
);

export { menuConfig };
