// 外部模块
import fp from 'fastify-plugin';
import fs from 'fs-extra';
import {
    //
    keyBy as _keyBy,
    isEmpty as _isEmpty,
    forEach as _forEach,
    forOwn as _forOwn,
    omit as _omit
} from 'lodash-es';
// 工具函数
import {
    //
    fnTimestamp,
    fnDbInsertData,
    fnDbUpdateData,
    fnMD5,
    fnPureMD5,
    fnIncrUID
} from '../utils/index.js';
// 配置文件
import { appConfig } from '../config/appConfig.js';

// 内置角色配置
const roleConfig = {
    dev: {
        name: '游客',
        describe: '具备有限的权限和有限的查看内容',
        is_system: 1
    },
    user: {
        name: '用户',
        describe: '用户权限和对于的内容查看',
        is_system: 1
    },
    admin: {
        name: '管理',
        describe: '管理权限、除开发相关权限之外的权限等',
        is_system: 1
    },
    super: {
        name: '超级管理',
        describe: '超级管理权限、除开发相关权限之外的权限等',
        is_system: 1
    }
};

async function plugin(fastify, opts) {
    // 同步接口
    try {
        // 准备好表
        const menuModel = fastify.mysql.table('sys_menu');
        const apiModel = fastify.mysql.table('sys_api');
        const adminModel = fastify.mysql.table('sys_admin');
        const roleModel = fastify.mysql.table('sys_role');

        // 查询所有角色
        const roleData = await roleModel.clone().select();

        // 查询开发管理员
        const devAdminData = await adminModel.clone().where('username', 'dev').first('id');

        // 查询开发角色
        const devRoleData = await roleModel.clone().where('code', 'dev').first('id');

        // 请求菜单数据，用于给开发管理员绑定菜单
        const menuData = await menuModel.clone().select();
        const menuIds = menuData.map((item) => item.id);
        const menuObject = _keyBy(menuData, 'value');

        // 请求接口数据，用于给开发管理员绑定接口
        const apiData = await apiModel.clone().select();
        const apiIds = apiData.map((item) => item.id);
        const apiObject = _keyBy(apiData, 'value');

        // 处理角色数据，如果有同名的角色则删除
        let insertRoleData = [];
        let deleteRoleData = [];
        let updateRoleData = [];

        let roleCodes = [];
        roleData.forEach((item) => {
            if (item.code && roleCodes.includes(item.code) === false) {
                roleCodes.push(item.code);
            } else {
                deleteRoleData.push(item.id);
            }
        });

        // 需要同步的角色，过滤掉数据库中已经存在的角色
        _forOwn(roleConfig, (item, key) => {
            if (roleCodes.includes(key) === false && key !== 'dev') {
                // 角色不存在，则添加
                item.id = fnIncrUID();
                item.code = key;
                item.api_ids = '';
                item.menu_ids = '';
                item.created_at = fnTimestamp();
                item.updated_at = fnTimestamp();
                insertRoleData.push(item);
            } else {
                updateRoleData.push({
                    code: key,
                    name: item.name,
                    describe: item.describe,
                    is_system: item.is_system || 0,
                    updated_at: fnTimestamp()
                });
            }
        });

        if (_isEmpty(deleteRoleData) === false) {
            await roleModel.clone().whereIn('id', deleteRoleData).delete();
        }

        if (insertRoleData.length > 0) {
            await roleModel.clone().insert(insertRoleData);
        }

        // 如果待更新接口目录大于0，则更新
        if (_isEmpty(updateRoleData) === false) {
            const updateBatchData = updateRoleData.map((item) => {
                return roleModel
                    .clone()
                    .where('code', item.code)
                    .update(_omit(item, ['code']));
            });
            await Promise.all(updateBatchData);
        }

        /**
         * 如果没有开发角色，则创建之
         * 如果有开发角色，则更新之
         */
        if (!devRoleData?.id) {
            const insertData = {
                id: fnIncrUID(),
                code: 'dev',
                name: appConfig.devName || '开发管理员',
                describe: '技术性相关的管理和维护',
                menu_ids: menuIds.join(','),
                api_ids: apiIds.join(',')
            };
            await roleModel.clone().insert(fnDbInsertData(insertData));
        } else {
            const updateData = {
                menu_ids: menuIds.join(','),
                api_ids: apiIds.join(',')
            };
            await roleModel.clone().where('code', 'dev').update(fnDbUpdateData(updateData));
        }

        // 如果没有开发管理员，则创建之
        if (!devAdminData?.id) {
            const insertData = {
                id: fnIncrUID(),
                username: 'dev',
                nickname: appConfig.devName || '开发管理员',
                role_codes: 'dev',
                password: fnMD5(fnPureMD5(appConfig.devPassword))
            };
            await adminModel.clone().insert(fnDbInsertData(insertData));
        } else {
            const updateData = {
                menu_ids: menuIds.join(','),
                api_ids: apiIds.join(',')
            };
            await roleModel.clone().where('code', 'dev').update(fnDbUpdateData(updateData));
            const updateData2 = {
                nickname: appConfig.devName || '开发管理员',
                password: fnMD5(fnPureMD5(appConfig.devPassword))
            };
            await adminModel.clone().where('username', 'dev').update(fnDbUpdateData(updateData2));
        }
        await fastify.cacheRoleData();
    } catch (err) {
        fastify.log.error(err);
        process.exit();
    }
}
export default fp(plugin, { name: 'sync', dependencies: ['mysql', 'redis', 'tool', 'syncApi', 'syncMenu'] });
