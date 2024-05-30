// 外部插件
import fp from 'fastify-plugin';
// 工具函数
import { isObject } from '../utils/isObject.js';
import { toKeyBy } from '../utils/toKeyBy.js';
import { toUnique } from '../utils/toUnique.js';
import { toOmit } from '../utils/toOmit.js';
import { fnIncrUID } from '../utils/fnIncrUID.js';
import { fnDelay } from '../utils/fnDelay.js';
import { toKebabCase } from '../utils/toKebabCase.js';
// 配置文件
import { appConfig } from '../config/app.js';
import { menuConfig } from '../config/menu.js';
import { blackMenusConfig } from '../config/blackMenus.js';

// 同步菜单目录
async function syncMenuDir(fastify) {
    try {
        // 准备好表
        const menuModel = fastify.mysql.table('sys_menu');

        // 第一次请求菜单数据，用于创建一级菜单
        const menuDirDb = await menuModel.clone().where({ pid: 0 }).selectAll();
        const menuDirDbByValue = toKeyBy(menuDirDb, 'value');

        const insertMenuDb = [];
        const deleteMenuDb = [];
        const updateMenuDb = [];
        let menuDbIndex = 1;

        for (let keyDir in menuConfig) {
            if (menuConfig.hasOwnProperty(keyDir) === false) continue;
            const itemDir = menuConfig[keyDir];
            const menuDirData = menuDirDbByValue[keyDir];
            if (menuDirData?.id) {
                updateMenuDb.push({
                    id: menuDirData.id,
                    name: itemDir.name,
                    value: keyDir,
                    sort: itemDir.sort || index,
                    is_system: itemDir.is_system || 0
                });
            } else {
                const insertData = {
                    name: itemDir.name,
                    value: keyDir,
                    pid: 0,
                    sort: itemDir.sort || menuDbIndex++,
                    is_open: 0,
                    is_system: itemDir.is_system || 0
                };
                if (appConfig.tablePrimaryKey === 'time') {
                    insertData.id = fnIncrUID();
                }
                insertMenuDb.push(insertData);
            }
        }

        // 获得删除数据
        menuDirDb.forEach((item) => {
            if (!item.value || !menuConfig[item.value]) {
                deleteMenuDb.push(item.id);
            }
        });

        if (process.env.NODE_APP_INSTANCE === undefined) {
            // 删除菜单目录
            if (deleteMenuDb.length > 0) {
                await menuModel.clone().whereIn('id', toUnique(deleteMenuDb)).deleteData();
            }

            // 添加菜单目录
            if (insertMenuDb.length > 0) {
                await menuModel.clone().insertData(insertMenuDb);
            }

            // 如果待更新接口目录大于 0，则更新
            if (updateMenuDb.length > 0) {
                const updateBatch = updateMenuDb.map((item) => {
                    return menuModel
                        .clone()
                        .where('id', item.id)
                        .updateData(toOmit(item, ['id']));
                });
                await Promise.all(updateBatch);
            }
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

        const menuDirDb = await menuModel.clone().where({ pid: 0 }).selectAll();
        const menuDirDbByValue = toKeyBy(menuDirDb, 'value');

        // 第二次请求菜单数据，用于创建二级菜单
        const menuFileDb = await menuModel.clone().where('pid', '<>', 0).selectAll();
        const menuFileDbByValue = toKeyBy(menuFileDb, 'value');

        const insertMenuDb = [];
        const updateMenuDb = [];
        const deleteMenuDb = [];
        const menuConfigByFileValue = {};

        for (let keyDir in menuConfig) {
            if (menuConfig.hasOwnProperty(keyDir) === false) continue;
            const menuChildren = menuConfig[keyDir].children;
            let menuDbIndex = 1;
            for (let keyFile in menuChildren) {
                if (menuChildren.hasOwnProperty(keyFile) === false) continue;
                const itemDir = menuConfig[keyDir];
                const itemFile = menuChildren[keyFile];
                const menuFileData = menuFileDbByValue[keyFile];
                const menuDirData = menuDirDbByValue[keyDir];
                menuConfigByFileValue[keyFile] = menuChildren[keyFile];
                if (menuFileData?.id) {
                    updateMenuDb.push({
                        id: menuFileData.id,
                        name: itemFile.name,
                        value: keyFile,
                        pid: menuDirData.id,
                        sort: itemFile.sort || menuDbIndex++,
                        is_system: itemFile.is_system || 0
                    });
                } else {
                    if (menuDirData) {
                        const insertMenuData = {
                            name: itemFile.name,
                            value: keyFile,
                            pid: menuDirData.id,
                            sort: itemFile.sort || menuDbIndex++,
                            is_open: 0,
                            is_system: itemFile.is_system || 0
                        };
                        if (appConfig.tablePrimaryKey === 'time') {
                            insertMenuData.id = fnIncrUID();
                        }
                        insertMenuDb.push(insertMenuData);
                    }
                }
            }
        }

        // 获得删除数据
        menuFileDb.forEach((item) => {
            if (!item.value || !menuConfigByFileValue[item.value]) {
                deleteMenuDb.push(item.id);
            }
        });

        // 数据的同步只在主进程中操作
        if (process.env.NODE_APP_INSTANCE === undefined) {
            if (deleteMenuDb.length > 0) {
                await menuModel.clone().whereIn('id', toUnique(deleteMenuDb)).deleteData();
            }

            if (insertMenuDb.length > 0) {
                await menuModel.clone().insertData(insertMenuDb);
            }

            // 如果待更新接口目录大于 0，则更新
            if (updateMenuDb.length > 0) {
                const updateBatchData = updateMenuDb.map((item) => {
                    return menuModel
                        .clone()
                        .where('id', item.id)
                        .updateData(toOmit(item, ['id']));
                });
                await Promise.all(updateBatchData);
            }
        }
    } catch (err) {
        fastify.log.error(err);
        process.exit();
    }
}

// 转换

async function plugin(fastify) {
    try {
        await syncMenuDir(fastify);
        await syncMenuFile(fastify);
        await fastify.cacheMenuData();
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'syncMenu', dependencies: ['redis', 'mysql', 'tool'] });
