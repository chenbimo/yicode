// 初始化用到的菜单配置，请勿改动
import path from 'path';
import { forOwn as _forOwn, values as _values } from 'lodash-es';
import { merge as mergeAny } from 'merge-anything';

import { fnFileProtocolPath, fnImport, fnMergeArray } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'menu.js'));
let { menuConfig: importConfig } = await fnImport(configPath, 'menuConfig', {});

const menuConfig = mergeAny(
    {
        '/people-data': {
            name: '人员数据',
            describe: '人员数据',
            children: {
                '/user': {
                    name: '用户',
                    describe: '用户列表'
                },
                '/admin': {
                    name: '管理员',
                    describe: '管理员列表'
                }
            }
        },
        '/notice-banner': {
            name: '公告轮播',
            describe: '公告轮播',
            children: {
                '/notice': {
                    name: '公告',
                    describe: '公告列表'
                },
                '/banner': {
                    name: '轮播图',
                    describe: '轮播图列表'
                }
            }
        },
        '/news-article': {
            name: '资讯文章',
            describe: '资讯文章',
            children: {
                '/news': {
                    name: '资讯',
                    describe: '资讯列表'
                }
            }
        },
        '/feedback-suggestion': {
            name: '反馈建议',
            describe: '反馈建议',
            children: {
                '/feedback': {
                    name: '反馈',
                    describe: '反馈列表'
                }
            }
        },
        '/permission-data': {
            name: '权限数据',
            describe: '权限数据',
            children: {
                '/menu': {
                    name: '菜单',
                    describe: '菜单列表'
                },
                '/api': {
                    name: '接口',
                    describe: '接口列表'
                },
                '/dictionary': {
                    name: '字典',
                    describe: '字典列表'
                },
                '/role': {
                    name: '角色',
                    describe: '角色列表'
                }
            }
        }
    },
    importConfig
);

export { menuConfig };
