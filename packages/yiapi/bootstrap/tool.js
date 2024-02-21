// 外部模块
import fp from 'fastify-plugin';
import fs from 'fs-extra';
import got from 'got';
import { keyBy as _keyBy } from 'lodash-es';
// 配置文件
import { appConfig } from '../config/appConfig.js';

async function plugin(fastify) {
    const redisSet = async (key, value, second = 0) => {
        if (second > 0) {
            await fastify.redis.set(key, JSON.stringify(value), 'EX', second);
        } else {
            await fastify.redis.set(key, JSON.stringify(value));
        }
    };
    const redisGet = async (key, unpack = false) => {
        const result = await fastify.redis.get(key);
        return JSON.parse(result);
    };

    const getUserApis = async (session) => {
        if (!session) return [];
        // 提取当前用户的角色码组
        const userRoleCodes = session.role_codes.split(',').filter((code) => code !== '');

        // 提取所有角色拥有的接口
        let apiIds = [];
        const dataRoleCodes = await redisGet('cacheData:role');
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
        const uniqApiIds = [...new Set(apiIds)];

        const dataApi = await redisGet('cacheData:api');

        // 最终的用户接口列表
        const result = dataApi
            .filter((item) => {
                return uniqApiIds.includes(item.id);
            })
            .map((item) => {
                return item;
            });
        return result;
    };

    const getUserMenus = async (session) => {
        try {
            if (session === null || session === undefined) return [];
            // 所有角色数组
            const userRoleCodes = session.role_codes.split(',').filter((code) => code !== '');

            // 所有菜单 ID
            let menuIds = [];

            const dataRoleCodes = await redisGet('cacheData:role');
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
            const dataMenu = await redisGet('cacheData:menu');

            const result = dataMenu.filter((item) => {
                if (userMenu.includes(item.id)) {
                    return true;
                } else {
                    return false;
                }
            });
            console.log('🚀 ~ result ~ result:', result);
            return result;
        } catch (err) {
            fastify.log.error(err);
        }
    };

    const cacheMenuData = async () => {
        // 菜单列表
        const dataMenu = await fastify.mysql.table('sys_menu').selectAll();

        // 菜单树数据
        await redisSet('cacheData:menu', []);
        await redisSet('cacheData:menu', dataMenu);
    };

    const cacheApiData = async () => {
        // 菜单列表
        const dataApi = await fastify.mysql.table('sys_api').selectAll();

        // 白名单接口
        const dataApiWhiteLists = dataApi.filter((item) => item.is_open === 1).map((item) => item.value);

        // 接口树数据
        await redisSet('cacheData:api', []);
        await redisSet('cacheData:api', dataApi);

        // 接口名称缓存
        await redisSet('cacheData:apiNames', []);
        await redisSet(
            'cacheData:apiNames',
            dataApi.filter((item) => item.is_bool === 1).map((item) => `/api${item.value}`)
        );

        // 白名单接口数据
        await redisSet('cacheData:apiWhiteLists', []);
        await redisSet('cacheData:apiWhiteLists', dataApiWhiteLists);
    };

    const cacheRoleData = async () => {
        // 角色类别
        const dataRole = await fastify.mysql.table('sys_role').selectAll();

        await redisSet('cacheData:role', []);
        await redisSet('cacheData:role', dataRole);
    };

    // 获取微信访问令牌
    const getWeixinAccessToken = async () => {
        try {
            const cacheWeixinAccessToken = await redisGet(`cacheData:weixinAccessToken`);
            if (cacheWeixinAccessToken) {
                return cacheWeixinAccessToken;
            } else {
                const res = await got('https://api.weixin.qq.com/cgi-bin/token', {
                    method: 'GET',
                    searchParams: {
                        grant_type: 'client_credential',
                        appid: appConfig.weixin.appId,
                        secret: appConfig.weixin.appSecret
                    }
                }).json();

                if (res.access_token) {
                    await redisSet(`cacheData:weixinAccessToken`, res.access_token, 6000);
                    return res.access_token;
                } else {
                    fastify.log.error(res);
                    return '';
                }
            }
        } catch (err) {
            fastify.log.error(err);
            return false;
        }
    };

    // 获取微信票据
    const getWeixinJsapiTicket = async () => {
        try {
            const cacheWeixinAccessToken = await getWeixinAccessToken();
            const res = await got('https://api.weixin.qq.com/cgi-bin/ticket/getticket', {
                method: 'GET',
                searchParams: {
                    type: 'jsapi',
                    access_token: cacheWeixinAccessToken
                }
            }).json();
            if (res.ticket) {
                redisSet(`cacheData:weixinJsapiTicket`, res.ticket, 6000);
            }
            return res.ticket;
        } catch (err) {
            fastify.log.error(err);
        }
    };

    // 设置和获取缓存数据
    fastify.decorate('redisSet', redisSet);
    fastify.decorate('redisGet', redisGet);
    // 获取当前登录用户可操作的接口列表
    fastify.decorate('getUserApis', getUserApis);
    // 获取用户的菜单
    fastify.decorate('getUserMenus', getUserMenus);
    // 设置权限数据
    fastify.decorate('cacheMenuData', cacheMenuData);
    // 设置权限数据
    fastify.decorate('cacheApiData', cacheApiData);
    // 设置角色数据
    fastify.decorate('cacheRoleData', cacheRoleData);
    // 获取微信 access_token
    fastify.decorate('getWeixinAccessToken', getWeixinAccessToken);
    // 获取微信 jsapi_ticket
    fastify.decorate('getWeixinJsapiTicket', getWeixinJsapiTicket);
}
export default fp(plugin, { name: 'tool', dependencies: ['mysql', 'redis'] });
