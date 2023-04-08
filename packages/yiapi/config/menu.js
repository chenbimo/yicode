// 初始化用到的菜单配置，请勿改动
import path from 'path';
import { forOwn as _forOwn } from 'lodash-es';
import { mergeAndConcat } from 'merge-anything';

import { fnFileProtocolPath, fnImport, fnMergeArray } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'menu.js'));
let { menuConfig: importConfig } = await fnImport(configPath, 'menuConfig', {});

const _menuConfig = mergeAndConcat(
    {
        '/peopleData': {
            name: '人员数据',
            describe: '人员数据',
            children: [
                {
                    name: '用户',
                    value: '/user'
                },
                {
                    name: '管理员',
                    value: '/admin'
                }
            ]
        },
        '/noticeAndBanner': {
            name: '公告轮播',
            describe: '公告轮播',
            children: [
                {
                    name: '公告',
                    value: '/notice'
                },
                {
                    name: '轮播图',
                    value: '/banner'
                }
            ]
        },
        '/newsAndArticle': {
            name: '资讯文章',
            describe: '资讯文章',
            children: [
                {
                    name: '文章',
                    value: '/article'
                },
                {
                    name: '资讯',
                    value: '/news'
                }
            ]
        },
        '/feedbackAndSuggestion': {
            name: '反馈建议',
            describe: '反馈建议',
            children: [
                {
                    name: '反馈',
                    value: '/feedback'
                }
            ]
        },
        '/permissionData': {
            name: '权限数据',
            describe: '权限数据',
            children: [
                {
                    name: '菜单',
                    value: '/menu'
                },
                {
                    name: '接口',
                    value: '/api'
                },
                {
                    name: '字典',
                    value: '/dictionary'
                },
                {
                    name: '角色',
                    value: '/role'
                }
            ]
        }
    },
    importConfig
);

let menuConfig = [];

_forOwn(_menuConfig, (item, key) => {
    item.value = key;
    menuConfig.push(item);
});

export { menuConfig };
