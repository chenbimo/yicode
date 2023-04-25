import fp from 'fastify-plugin';
import { forEach as _forEach, isEmpty as _isEmpty, keyBy as _keyBy } from 'lodash-es';

import { fnCamelCase, fnUUID, fnTimestamp } from '../utils/index.js';
import { menuConfig } from '../config/menu.js';
import { mapTableConfig } from '../config/mapTable.js';

// 同步菜单目录
async function syncMenuDir(fastify) {
    try {
        // 准备好表
        let menuModel = fastify.mysql.table(mapTableConfig.sys_menu);

        // 第一次请求菜单数据，用于创建一级菜单
        let menuData = await menuModel.clone().where({ pid: 0 }).select();
        let menuValue = [];

        // 将要添加的目录数据
        let insertMenuData = [];

        // 将要删除的数据
        let deleteMenuData = [];

        menuData.forEach((item) => {
            if (menuValue.includes(item.name)) {
                deleteMenuData.push(item.uuid);
            } else {
                menuValue.push(item.name);
            }
        });

        _forEach(menuConfig, (item, index) => {
            item.value = fnCamelCase(item.value);

            if (menuValue.includes(item.name) === false) {
                insertMenuData.push({
                    uuid: fnUUID(),
                    name: item.name,
                    value: item.value,
                    level: 1,
                    pids: '0',
                    pid: 0,
                    sort: index,
                    is_open: 0,
                    describe: item.describe || '',
                    created_at: fnTimestamp(),
                    updated_at: fnTimestamp()
                });
            }
        });

        if (_isEmpty(deleteMenuData)) {
            await menuModel.clone().whereIn('uuid', deleteMenuData).delete();
        }

        if (_isEmpty(insertMenuData) === false) {
            await menuModel.clone().insert(insertMenuData);
        }
    } catch (err) {
        fastify.log.error(err);
    }
}
// TODO: 需要进一步处理相同父级菜单下的同名子菜单去重问题

// 同步菜单文件
async function syncMenuFile(fastify) {
    try {
        // 准备好表
        let menuModel = fastify.mysql.table(`${mapTableConfig.sys_menu}`);

        let menuParentData = await menuModel.clone().where({ pid: 0 }).select();
        let menuParentObject = _keyBy(menuParentData, 'name');

        // 第二次请求菜单数据，用于创建二级菜单
        let menuChildData = await menuModel.clone().andWhere('pid', '<>', 0).select();

        // 菜单名数组
        let menuValue = [];

        // 将要删除的数据
        let deleteMenuFile = [];

        menuChildData.forEach((item) => {
            if (menuValue.includes(item.name)) {
                deleteMenuFile.push(item.uuid);
            } else {
                menuValue.push(item.name);
            }
        });

        // 待添加的子菜单（二级菜单）
        let insertMenuFile = [];

        _forEach(menuConfig, (mainItem) => {
            mainItem.value = fnCamelCase(mainItem.value);

            _forEach(mainItem.children, (item, index) => {
                item.value = fnCamelCase(item.value);

                if (menuValue.includes(item.name) === false) {
                    let parentMenuData = menuParentObject[mainItem.name] || null;

                    if (parentMenuData) {
                        insertMenuFile.push({
                            uuid: fnUUID(),
                            name: item.name,
                            value: item.value,
                            level: 2,
                            pids: `0,${parentMenuData.id}`,
                            pid: parentMenuData.id,
                            sort: index,
                            is_open: 0,
                            describe: item.describe || '',
                            created_at: fnTimestamp(),
                            updated_at: fnTimestamp()
                        });
                    }
                }
            });
        });

        if (_isEmpty(deleteMenuFile) === false) {
            await menuModel.clone().whereIn('uuid', deleteMenuFile).delete();
        }

        if (_isEmpty(insertMenuFile) === false) {
            await menuModel.clone().insert(insertMenuFile);
        }
    } catch (err) {
        fastify.log.error(err);
    }
}

async function plugin(fastify) {
    try {
        await syncMenuDir(fastify);
        await syncMenuFile(fastify);
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'syncMenu', dependencies: ['mysql', 'redis', 'tool'] });
