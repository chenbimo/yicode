// 外部插件
import fp from 'fastify-plugin';
import {
    //
    forEach as _forEach,
    isEmpty as _isEmpty,
    keyBy as _keyBy,
    omit as _omit,
    forOwn as _forOwn,
    isObject as _isObject,
    cloneDeep as _cloneDeep,
    uniq as _uniq,
    merge as _merge
} from 'lodash-es';
// 工具函数
import { fnKebabCase, fnIncrUID } from '../utils/index.js';
// 配置文件
import { appConfig } from '../config/appConfig.js';

let menuConfigNew = [];
let menuDirNew = [];
let menuFileNew = [];

// 菜单配置
const menuConfig = _merge(appConfig.menu, {
    '/internal/home': {
        name: '首页数据',
        sort: 1,
        is_system: 1,
        children: {
            '/': {
                name: '首页',
                is_system: 1,
                sort: 1
            }
        }
    },
    '/internal/banner': {
        name: '轮播管理',
        sort: 1000,
        is_system: 1,
        children: {
            '/': {
                name: '轮播列表',
                is_system: 1,
                sort: 1
            }
        }
    },
    '/internal/people': {
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
    '/internal/permission': {
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
    '/internal/setup': {
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
    '/internal/log': {
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

// 同步菜单目录
async function syncMenuDir(fastify) {
    try {
        // 准备好表
        const menuModel = fastify.mysql.table('sys_menu');

        // 第一次请求菜单数据，用于创建一级菜单
        const menuDir = await menuModel.clone().where({ pid: 0 }).selectAll();
        const menuDirByValue = _keyBy(menuDir, 'value');

        let deleteMenuDirValue = [];
        let insertMenuDir = [];
        let deleteMenuDir = [];
        let updateMenuDir = [];

        // 删除重复数据
        menuDir.forEach((item) => {
            if (deleteMenuDirValue.includes(item.value) === true) {
                deleteMenuDir.push(item.id);
            } else {
                deleteMenuDirValue.push(item.value);
            }
        });

        _forEach(menuConfigNew, (item, index) => {
            // 映射的菜单数据
            const mapMenu = menuDirByValue[item.value];
            if (!mapMenu) {
                let insertData = {
                    name: item.name,
                    value: item.value,
                    pid: 0,
                    sort: item.sort || index,
                    is_open: 0,
                    is_system: item.is_system || 0
                };
                if (appConfig.tablePrimaryKey === 'time') {
                    insertData.id = fnIncrUID();
                }
                insertMenuDir.push(insertData);
            } else {
                updateMenuDir.push({
                    id: mapMenu.id,
                    name: item.name,
                    value: item.value,
                    sort: item.sort || index,
                    is_system: item.is_system || 0
                });
            }
        });

        // 删除菜单目录
        if (_isEmpty(deleteMenuDir) === false) {
            await menuModel.clone().whereIn('id', _uniq(deleteMenuDir)).deleteData();
        }

        // 添加菜单目录
        if (_isEmpty(insertMenuDir) === false) {
            await menuModel.clone().insertData(insertMenuDir);
        }

        // 如果待更新接口目录大于 0，则更新
        if (_isEmpty(updateMenuDir) === false) {
            const updateBatch = updateMenuDir.map((item) => {
                return menuModel
                    .clone()
                    .where('id', item.id)
                    .updateData(_omit(item, ['id']));
            });
            await Promise.all(updateBatch);
        }
    } catch (err) {
        fastify.log.error(err);
        process.exit();
    }
}
// TODO: 需要进一步处理相同父级菜单下的同名子菜单去重问题

// 同步菜单文件
async function syncMenuFile(fastify) {
    try {
        // 准备好表
        const menuModel = fastify.mysql.table('sys_menu');

        const menuDir = await menuModel.clone().where({ pid: 0 }).selectAll();
        const menuDirByValue = _keyBy(menuDir, 'value');

        // 第二次请求菜单数据，用于创建二级菜单
        const menuData = await menuModel.clone().andWhere('pid', '<>', 0).selectAll();
        const menuByValue = _keyBy(menuData, 'value');

        let deleteMenuFileValue = [];
        let insertMenuFile = [];
        let updateMenuFile = [];
        let deleteMenuFile = [];

        // 获得删除数据
        menuData.forEach((item) => {
            if (deleteMenuFileValue.includes(item.value)) {
                deleteMenuFile.push(item.id);
            } else {
                deleteMenuFileValue.push(item.value);
            }
        });

        _forEach(menuConfigNew, (menu, index1) => {
            _forEach(menu.children, (item, index2) => {
                const mapMenu = menuByValue[item.value];
                const parentMenuData = menuDirByValue[menu.value];
                if (!mapMenu) {
                    if (parentMenuData) {
                        let insertMenuData = {
                            name: item.name,
                            value: item.value,
                            pid: parentMenuData.id,
                            sort: item.sort || index2,
                            is_open: 0,
                            is_system: item.is_system || 0
                        };
                        if (appConfig.tablePrimaryKey === 'time') {
                            insertMenuData.id = fnIncrUID();
                        }
                        insertMenuFile.push(insertMenuData);
                    }
                } else {
                    updateMenuFile.push({
                        id: mapMenu.id,
                        name: item.name,
                        value: item.value,
                        pid: parentMenuData.id,
                        sort: item.sort || index2,
                        is_system: item.is_system || 0
                    });
                }
            });
        });

        if (_isEmpty(deleteMenuFile) === false) {
            await menuModel.clone().whereIn('id', _uniq(deleteMenuFile)).deleteData();
        }

        if (_isEmpty(insertMenuFile) === false) {
            await menuModel.clone().insertData(insertMenuFile);
        }

        // 如果待更新接口目录大于 0，则更新
        if (_isEmpty(updateMenuFile) === false) {
            const updateBatchData = updateMenuFile.map((item) => {
                return menuModel
                    .clone()
                    .where('id', item.id)
                    .updateData(_omit(item, ['id']));
            });
            await Promise.all(updateBatchData);
        }
    } catch (err) {
        fastify.log.error(err);
        process.exit();
    }
}

// 转换菜单结构
async function convertMenuStruct() {
    let dataArray = [];
    _forOwn(menuConfig, (item, key) => {
        if (appConfig.blackMenus.includes(key) !== true) {
            item.value = fnKebabCase(key);
            menuDirNew.push(item.value);
            if (_isObject(item['children'])) {
                const childrenData = _cloneDeep(item['children']);
                item['children'] = [];
                _forOwn(childrenData, (item2, key2) => {
                    if (appConfig.blackMenus.includes(key) !== true) {
                        item2.value = fnKebabCase(key2);
                        menuFileNew.push(item2.value);
                        item['children'].push(item2);
                    }
                });
            }
            dataArray.push(item);
        }
    });
    return dataArray;
}

async function plugin(fastify) {
    try {
        menuConfigNew = await convertMenuStruct();

        await syncMenuDir(fastify);
        await syncMenuFile(fastify);
        await fastify.cacheMenuData();
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'syncMenu', dependencies: ['mysql', 'redis', 'tool'] });
