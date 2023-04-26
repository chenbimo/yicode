import fp from 'fastify-plugin';
import fs from 'fs-extra';
import { mapTableConfig } from '../config/mapTable.js';

import {
    //
    keyBy as _keyBy,
    isEmpty as _isEmpty,
    forEach as _forEach,
    omit as _omit
} from 'lodash-es';
import {
    //
    fnTimestamp,
    fnUUID,
    fnClearInsertData,
    fnClearUpdateData,
    fnMD5,
    fnPureMD5
} from '../utils/index.js';

import { appConfig } from '../config/app.js';
import { roleConfig } from '../config/role.js';

async function plugin(fastify, opts) {
    // 同步接口
    try {
        // 准备好表
        let treeModel = fastify.mysql.table(`${mapTableConfig.sys_tree}`);
        let adminModel = fastify.mysql.table(`${mapTableConfig.sys_admin}`);
        let roleModel = fastify.mysql.table(`${mapTableConfig.sys_role}`);

        // 查询所有角色
        let roleData = await roleModel.clone().select();
        let roleCodes = roleData.map((item) => item.code);
        let roleObject = _keyBy(roleData, 'code');

        // 查询开发管理员
        let devAdminData = await adminModel.clone().where('username', 'dev').first();

        // 查询开发角色
        let devRoleData = await roleModel.clone().where('code', 'dev').first();

        // 请求菜单数据，用于给开发管理员绑定菜单
        let menuData = await treeModel.clone().where('category', 'menu').select();
        let menuIds = menuData.map((item) => item.id);
        let menuObject = _keyBy(menuData, 'value');

        // 请求接口数据，用于给开发管理员绑定接口
        let apiData = await treeModel.clone().where('category', 'api').select();
        let apiIds = apiData.map((item) => item.id);
        let apiObject = _keyBy(apiData, 'value');

        /**
         * 获取缓存的数据角色
         * 并将菜单和接口路径变成 id 数组
         */
        // let fileRoleData = fs.readJsonSync('./data/roleData.json', { throws: false });
        // let cacheRoleData = _isEmpty(fileRoleData) ? [] : fileRoleData;
        // cacheRoleData.forEach((item) => {
        //     item.menu_ids = item.menu_ids
        //         .map((value) => {
        //             return menuObject[value]?.id;
        //         })
        //         .filter((v) => v);

        //     item.api_ids = item.api_ids
        //         .map((value) => {
        //             return apiObject[value]?.id;
        //         })
        //         .filter((v) => v);
        // });

        // let cacheRoleDataObjectByCode = _keyBy(cacheRoleData, 'code');

        let insertRoleData = [];
        // let updateRoleData = [];

        // 需要同步的角色，过滤掉数据库中已经存在的角色
        _forEach(roleConfig, (item) => {
            if (roleCodes.includes(item.code) === false && item.code !== 'dev') {
                // 角色存在，则更新
                // let currentRoleData = cacheRoleDataObjectByCode[item.code];
                // if (currentRoleData) {
                // item.uuid = roleObject[item.code]?.uuid || '';
                // item.api_ids = currentRoleData.api_ids.join(',');
                // item.menu_ids = currentRoleData.api_ids.join(',');
                // item.updated_at = fnTimestamp();
                // updateRoleData.push(item);
                // }
                // 角色不存在，则添加
                item.uuid = fnUUID();
                item.api_ids = '';
                item.menu_ids = '';
                item.created_at = fnTimestamp();
                item.updated_at = fnTimestamp();
                insertRoleData.push(item);
            }
        });

        if (insertRoleData.length > 0) {
            await roleModel.clone().insert(insertRoleData);
        }

        // 如果待更新接口目录大于 0，则更新
        // if (_isEmpty(updateRoleData) === false) {
        //     const updateBatchData = updateRoleData.map((item) => {
        //         return roleModel.clone().where('uuid', item.uuid).update(_omit(item, 'uuid'));
        //     });
        //     await Promise.all(updateBatchData);
        // }

        // 存储开发管理员角色对应的 ID 值
        // let devRoleId = null;

        /**
         * 如果没有开发角色，则创建之
         * 如果有开发角色，则更新之
         */
        if (!devRoleData) {
            let insertData = {
                code: 'dev',
                name: '开发管理员',
                describe: '技术性相关的管理和维护',
                menu_ids: menuIds.join(','),
                api_ids: apiIds.join(',')
            };
            await roleModel.clone().insert(fnClearInsertData(insertData));
        } else {
            await roleModel
                .clone()
                .where('code', 'dev')
                .update({
                    menu_ids: menuIds.join(','),
                    api_ids: apiIds.join(','),
                    updated_at: fnTimestamp()
                });
        }

        // 如果没有开发管理员，则创建之
        if (!devAdminData) {
            let insertApiData = {
                username: 'dev',
                nickname: '开发管理员',
                role_codes: 'dev',
                password: fnMD5(fnPureMD5(appConfig.devPassword))
            };
            await adminModel.clone().insert(fnClearInsertData(insertApiData));
        } else {
            await adminModel
                .clone()
                .where('username', 'dev')
                .update(fnClearUpdateData({ password: fnMD5(fnPureMD5(appConfig.devPassword)) }));
        }
        await fastify.cacheRoleData();
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'sync', dependencies: ['mysql', 'redis', 'tool', 'syncApi', 'syncMenu'] });
