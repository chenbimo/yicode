// 初始化用到的菜单配置，请勿改动
import path from 'path';
import { forOwn as _forOwn, values as _values } from 'lodash-es';
import { mergeAndConcat } from 'merge-anything';

import { fnFileProtocolPath, fnImport, fnMergeArray } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'menu.js'));
let { menuConfig: importConfig } = await fnImport(configPath, 'menuConfig', {});

const menuConfig = _values(
    mergeAndConcat(
        {
            人员数据: {
                name: '人员数据',
                value: '/peopleData',
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
            公告轮播: {
                name: '公告轮播',
                describe: '公告轮播',
                value: '/noticeAndBanner',
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
            资讯文章: {
                name: '资讯文章',
                describe: '资讯文章',
                value: '/newsAndArticle',
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
            反馈建议: {
                name: '反馈建议',
                describe: '反馈建议',
                value: 'feedbackAndSuggestion',
                children: [
                    {
                        name: '反馈',
                        value: '/feedback'
                    }
                ]
            },
            权限数据: {
                name: '权限数据',
                describe: '权限数据',
                value: 'permissionData',
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
    )
);

export { menuConfig };
