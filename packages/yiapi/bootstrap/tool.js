import fp from 'fastify-plugin';
import fs from 'fs-extra';
import got from 'got';
import { keyBy as _keyBy } from 'lodash-es';

import { appConfig } from '../config/appConfig.js';
import { cacheData } from '../config/cacheData.js';

async function plugin(fastify, opts) {
    fastify.decorate('redisSet', async (key, value, second = 0) => {
        if (second > 0) {
            await fastify.redis.set(key, JSON.stringify(value), 'EX', second);
        } else {
            await fastify.redis.set(key, JSON.stringify(value));
        }
    });
    fastify.decorate('redisGet', async (key, unpack = false) => {
        let result = await fastify.redis.get(key);
        return JSON.parse(result);
    });

    // 获取当前登录用户可操作的接口列表
    fastify.decorate('getUserApis', async (session) => {
        if (session === null || session === undefined) return [];
        // 提取当前用户的角色码组
        let userRoleCodes = session.role_codes.split(',').filter((code) => code !== '');

        // 提取所有角色拥有的接口
        let apiIds = [];
        let dataRoleCodes = await fastify.redisGet(cacheData.role);
        dataRoleCodes.forEach((item) => {
            if (userRoleCodes.includes(item.code)) {
                apiIds = item.api_ids
                    .split(',')
                    .filter((id) => id !== '')
                    .map((id) => Number(id))
                    .concat(apiIds);
            }
        });

        // 将接口进行唯一性处理
        let uniqApiIds = [...new Set(apiIds)];

        let dataApi = await fastify.redisGet(cacheData.api);

        // 最终的用户接口列表
        let result = dataApi
            .filter((item) => {
                return uniqApiIds.includes(item.id);
            })
            .map((item) => {
                return item;
            });
        return result;
    });

    // 获取用户的菜单
    fastify.decorate('getUserMenus', async (session) => {
        try {
            if (session === null || session === undefined) return [];
            // 所有角色数组
            let userRoleCodes = session.role_codes.split(',').filter((code) => code !== '');

            // 所有菜单 ID
            let menuIds = [];

            const dataRoleCodes = await fastify.redisGet(cacheData.role);
            dataRoleCodes.forEach((item) => {
                if (userRoleCodes.includes(item.code)) {
                    menuIds = item.menu_ids
                        .split(',')
                        .filter((id) => id !== '')
                        .map((id) => Number(id))
                        .concat(menuIds);
                }
            });

            const userMenu = [...new Set(menuIds)];
            const dataMenu = await fastify.redisGet(cacheData.menu);

            let result = dataMenu.filter((item) => {
                if (item.state === 0 && userMenu.includes(item.id)) {
                    return true;
                } else {
                    return false;
                }
            });
            return result;
        } catch (err) {
            fastify.log.error(err);
        }
    });

    // 设置权限数据
    fastify.decorate('cacheTreeData', async () => {
        // 菜单列表
        let dataMenu = await fastify.mysql.table('sys_menu').select();
        let dataApi = await fastify.mysql.table('sys_api').select();

        // 白名单接口
        let dataApiWhiteLists = dataApi.filter((item) => item.is_open === 1).map((item) => item.value);

        // 菜单树数据
        await fastify.redisSet(cacheData.menu, []);
        await fastify.redisSet(cacheData.menu, dataMenu);

        // 接口树数据
        await fastify.redisSet(cacheData.api, []);
        await fastify.redisSet(cacheData.api, dataApi);

        // 接口名称缓存
        await fastify.redisSet(cacheData.apiNames, []);
        await fastify.redisSet(
            cacheData.apiNames,
            dataApi.filter((item) => item.is_bool === 1).map((item) => `/api${item.value}`)
        );

        // 白名单接口数据
        await fastify.redisSet(cacheData.apiWhiteLists, []);
        await fastify.redisSet(cacheData.apiWhiteLists, dataApiWhiteLists);
    });

    // 设置角色数据
    fastify.decorate('cacheRoleData', async (type) => {
        // 角色类别
        let dataRole = await fastify.mysql.table('sys_role').select();

        await fastify.redisSet(cacheData.role, []);
        await fastify.redisSet(cacheData.role, dataRole);
    });

    // 获取微信 access_token
    fastify.decorate('getWeixinAccessToken', async () => {
        let cacheWeixinAccessToken = await fastify.redisGet(cacheData.weixinAccessToken);
        if (cacheWeixinAccessToken) {
            return {
                accessToken: cacheWeixinAccessToken
            };
        }
        let res = await got('https://api.weixin.qq.com/cgi-bin/token', {
            method: 'GET',
            searchParams: {
                grant_type: 'client_credential',
                appid: weixinConfig.appId,
                secret: weixinConfig.appSecret
            }
        }).json();
        return res;
    });
}
export default fp(plugin, { name: 'tool', dependencies: ['mysql', 'redis'] });
