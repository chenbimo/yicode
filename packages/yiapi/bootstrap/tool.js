// 外部模块
import fp from 'fastify-plugin';
import got from 'got';
// 配置文件
import { weixinConfig } from '../config/weixin.js';

async function plugin(fastify) {
    // 设置 redis
    const redisSet = async (key, value, second = 0) => {
        if (second > 0) {
            await fastify.redis.set(key, JSON.stringify(value), 'EX', second);
        } else {
            await fastify.redis.set(key, JSON.stringify(value));
        }
    };

    // 获取 redis
    const redisGet = async (key, unpack = false) => {
        const result = await fastify.redis.get(key);
        return JSON.parse(result);
    };

    const getUserApis = async (session) => {
        if (!session) return [];
        // 提取当前用户的角色码组

        // 提取所有角色拥有的接口
        let apiIds = [];
        const dataRoleCodes = await redisGet('cacheData:role');
        dataRoleCodes.forEach((item) => {
            if (session.role === item.code) {
                apiIds = item.api_ids
                    .split(',')
                    .filter((id) => id !== '')
                    .map((id) => Number(id));
            }
        });

        // 将接口进行唯一性处理
        const userApiIds = [...new Set(apiIds)];
        const dataApi = await redisGet('cacheData:api');
        // 最终的用户接口列表
        const result = dataApi.filter((item) => {
            return userApiIds.includes(item.id);
        });
        return result;
    };

    const getUserMenus = async (session) => {
        try {
            if (!session) return [];

            // 所有菜单 ID
            let menuIds = [];

            const dataRoleCodes = await redisGet('cacheData:role');
            dataRoleCodes.forEach((item) => {
                if (session.role === item.code) {
                    menuIds = item.menu_ids
                        .split(',')
                        .filter((id) => id !== '')
                        .map((id) => Number(id));
                }
            });

            const userMenuIds = [...new Set(menuIds)];
            const dataMenu = await redisGet('cacheData:menu');

            const result = dataMenu.filter((item) => {
                return userMenuIds.includes(item.id);
            });
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
                        appid: weixinConfig.appId,
                        secret: weixinConfig.appSecret
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
                await redisSet(`cacheData:weixinJsapiTicket`, res.ticket, 6000);
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
export default fp(plugin, { name: 'tool', dependencies: ['redis', 'mysql'] });
