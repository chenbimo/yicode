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
import { fnSaltMD5 } from '../utils/fnSaltMD5.js';
import { fnPureMD5 } from '../utils/fnPureMD5.js';
import { fnIncrUID } from '../utils/fnIncrUID.js';
// 配置文件
import { appConfig } from '../config/app.js';

// 内置角色配置
const roleConfig = {
    visitor: {
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
        const roleData = await roleModel.clone().selectAll();

        // 查询开发管理员
        const devAdminData = await adminModel.clone().where('username', 'dev').selectOne('id');

        // 查询开发角色
        const devRoleData = await roleModel.clone().where('code', 'dev').selectOne('id');

        // 请求菜单数据，用于给开发管理员绑定菜单
        const menuData = await menuModel.clone().selectAll();
        const menuIds = menuData.map((item) => item.id);
        const menuObject = _keyBy(menuData, 'value');

        // 请求接口数据，用于给开发管理员绑定接口
        const apiData = await apiModel.clone().selectAll();
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
                if (appConfig.tablePrimaryKey === 'time') {
                    item.id = fnIncrUID();
                }
                item.code = key;
                item.api_ids = '';
                item.menu_ids = '';
                insertRoleData.push(item);
            } else {
                updateRoleData.push({
                    code: key,
                    name: item.name,
                    describe: item.describe,
                    is_system: item.is_system || 0
                });
            }
        });

        if (_isEmpty(deleteRoleData) === false) {
            await roleModel.clone().whereIn('id', deleteRoleData).deleteData();
        }

        if (insertRoleData.length > 0) {
            await roleModel.clone().insertData(insertRoleData);
        }

        // 如果待更新接口目录大于 0，则更新
        if (_isEmpty(updateRoleData) === false) {
            const updateBatchData = updateRoleData.map((item) => {
                return roleModel
                    .clone()
                    .where('code', item.code)
                    .updateData(_omit(item, ['code']));
            });
            await Promise.all(updateBatchData);
        }

        /**
         * 如果没有开发角色，则创建之
         * 如果有开发角色，则更新之
         */
        if (!devRoleData?.id) {
            let insertData = {
                code: 'dev',
                name: appConfig.devName || '开发管理员',
                describe: '技术性相关的管理和维护',
                menu_ids: menuIds.join(','),
                api_ids: apiIds.join(',')
            };
            if (appConfig.tablePrimaryKey === 'time') {
                insertData.id = fnIncrUID();
            }
            await roleModel.clone().insertData(insertData);
        } else {
            const updateData = {
                menu_ids: menuIds.join(','),
                api_ids: apiIds.join(',')
            };
            await roleModel.clone().where('code', 'dev').updateData(updateData);
        }

        // 如果没有开发管理员，则创建之
        if (!devAdminData?.id) {
            let insertData = {
                username: 'dev',
                nickname: '开发管理员',
                role_codes: 'dev',
                password: fnSaltMD5(fnPureMD5(appConfig.devPassword))
            };
            if (appConfig.tablePrimaryKey === 'time') {
                insertData.id = fnIncrUID();
            }
            await adminModel.clone().insertData(insertData);
        } else {
            await roleModel
                .clone()
                .where('code', 'dev')
                .updateData({
                    menu_ids: menuIds.join(','),
                    api_ids: apiIds.join(',')
                });
            await adminModel
                .clone()
                .where('username', 'dev')
                .updateData({
                    nickname: '开发管理员',
                    password: fnSaltMD5(fnPureMD5(appConfig.devPassword))
                });
        }
        await fastify.cacheRoleData();
    } catch (err) {
        fastify.log.error(err);
        process.exit();
    }
}
export default fp(plugin, { name: 'syncDev', dependencies: ['redis', 'mysql', 'tool', 'syncApi', 'syncMenu'] });
