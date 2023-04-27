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
        let menuModel = fastify.mysql.table(mapTableConfig.sys_menu);
        let apiModel = fastify.mysql.table(mapTableConfig.sys_api);
        let adminModel = fastify.mysql.table(mapTableConfig.sys_admin);
        let roleModel = fastify.mysql.table(mapTableConfig.sys_role);

        // 查询所有角色
        let roleData = await roleModel.clone().select();
        let roleCodes = roleData.map((item) => item.code);
        let roleObject = _keyBy(roleData, 'code');

        // 查询开发管理员
        let devAdminData = await adminModel.clone().where('username', 'dev').first();

        // 查询开发角色
        let devRoleData = await roleModel.clone().where('code', 'dev').first();

        // 请求菜单数据，用于给开发管理员绑定菜单
        let menuData = await menuModel.clone().select();
        let menuIds = menuData.map((item) => item.id);
        let menuObject = _keyBy(menuData, 'value');

        // 请求接口数据，用于给开发管理员绑定接口
        let apiData = await apiModel.clone().select();
        let apiIds = apiData.map((item) => item.id);
        let apiObject = _keyBy(apiData, 'value');

        let insertRoleData = [];
        // let updateRoleData = [];

        // 需要同步的角色，过滤掉数据库中已经存在的角色
        _forEach(roleConfig, (item) => {
            if (roleCodes.includes(item.code) === false && item.code !== 'dev') {
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

        /**
         * 如果没有开发角色，则创建之
         * 如果有开发角色，则更新之
         */
        if (!devRoleData) {
            let insertData = {
                code: 'dev',
                name: appConfig.devName || '开发管理员',
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
            let insertData = {
                username: 'dev',
                nickname: appConfig.devName || '开发管理员',
                role_codes: 'dev',
                password: fnMD5(fnPureMD5(appConfig.devPassword))
            };
            await adminModel.clone().insert(fnClearInsertData(insertData));
        } else {
            await roleModel
                .clone()
                .where('code', 'dev')
                .update({
                    menu_ids: menuIds.join(','),
                    api_ids: apiIds.join(','),
                    updated_at: fnTimestamp()
                });
            await adminModel
                .clone()
                .where('username', 'dev')
                .update({
                    nickname: appConfig.devName || '开发管理员',
                    password: fnMD5(fnPureMD5(appConfig.devPassword))
                });
        }
        await fastify.cacheRoleData();
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'sync', dependencies: ['mysql', 'redis', 'tool', 'syncApi', 'syncMenu'] });
