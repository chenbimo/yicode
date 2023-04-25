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
    uniq as _uniq
} from 'lodash-es';

import { fnUUID, fnTimestamp, fnKebabCase } from '../utils/index.js';
import { menuConfig } from '../config/menu.js';
import { mapTableConfig } from '../config/mapTable.js';

let menuConfigNew = [];
let menuDirNew = [];
let menuFileNew = [];

// 同步菜单目录
async function syncMenuDir(fastify) {
    try {
        // 准备好表
        let menuModel = fastify.mysql.table(mapTableConfig.sys_menu);

        // 第一次请求菜单数据，用于创建一级菜单
        let menuDir = await menuModel.clone().where({ pid: 0 }).select();
        let menuDirByValue = _keyBy(menuDir, 'value');

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
            if (menuDirNew.includes(item.value) === false) {
                deleteMenuDir.push(item.id);
            }
        });

        _forEach(menuConfigNew, (item, index) => {
            // item.value = fnKebabCase(item.value);
            // 映射的菜单数据
            let mapMenu = menuDirByValue[item.value];
            if (!mapMenu) {
                insertMenuDir.push({
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
            } else {
                updateMenuDir.push({
                    id: mapMenu.id,
                    name: item.name,
                    value: item.value,
                    describe: item.describe || '',
                    updated_at: fnTimestamp()
                });
            }
        });

        // 删除菜单目录
        if (_isEmpty(deleteMenuDir) === false) {
            await menuModel.clone().whereIn('id', _uniq(deleteMenuDir)).delete();
        }

        // 添加菜单目录
        if (_isEmpty(insertMenuDir) === false) {
            await menuModel.clone().insert(insertMenuDir);
        }

        // 如果待更新接口目录大于0，则更新
        if (_isEmpty(updateMenuDir) === false) {
            const updateBatch = updateMenuDir.map((item) => {
                return menuModel
                    .clone()
                    .where('id', item.id)
                    .update(_omit(item, ['id']));
            });
            await Promise.all(updateBatch);
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

        let menuDir = await menuModel.clone().where({ pid: 0 }).select();
        let menuDirByValue = _keyBy(menuDir, 'value');

        // 第二次请求菜单数据，用于创建二级菜单
        let menuData = await menuModel.clone().andWhere('pid', '<>', 0).select();
        let menuByValue = _keyBy(menuData, 'value');

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
            if (menuFileNew.includes(item.value) === false) {
                deleteMenuFile.push(item.id);
            }
        });

        _forEach(menuConfigNew, (mainItem) => {
            // mainItem.value = fnKebabCase(mainItem.value);
            _forEach(mainItem.children, (item, index) => {
                // item.value = fnKebabCase(item.value);
                let mapMenu = menuByValue[item.value];
                if (!mapMenu) {
                    let parentMenuData = menuDirByValue[mainItem.value];

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
                } else {
                    updateMenuFile.push({
                        id: mapMenu.id,
                        name: item.name,
                        value: item.value,
                        describe: item.describe || '',
                        updated_at: fnTimestamp()
                    });
                }
            });
        });

        if (_isEmpty(deleteMenuFile) === false) {
            await menuModel.clone().whereIn('id', _uniq(deleteMenuFile)).delete();
        }

        if (_isEmpty(insertMenuFile) === false) {
            await menuModel.clone().insert(insertMenuFile);
        }

        // 如果待更新接口目录大于0，则更新
        if (_isEmpty(updateMenuFile) === false) {
            const updateBatchData = updateMenuFile.map((item) => {
                return menuModel
                    .clone()
                    .where('id', item.id)
                    .update(_omit(item, ['id']));
            });
            await Promise.all(updateBatchData);
        }
    } catch (err) {
        fastify.log.error(err);
    }
}

// 转换菜单结构
async function convertMenuStruct() {
    let dataArray = [];
    _forOwn(menuConfig, (item, key) => {
        item.value = fnKebabCase(key);
        menuDirNew.push(item.value);
        if (_isObject(item['children'])) {
            let childrenData = _cloneDeep(item['children']);
            item['children'] = [];
            _forOwn(childrenData, (item2, key2) => {
                item2.value = fnKebabCase(key2);
                menuFileNew.push(item2.value);
                item['children'].push(item2);
            });
        }
        dataArray.push(item);
    });
    return dataArray;
}

async function plugin(fastify) {
    try {
        menuConfigNew = await convertMenuStruct();

        await syncMenuDir(fastify);
        await syncMenuFile(fastify);
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'syncMenu', dependencies: ['mysql', 'redis', 'tool'] });
