import got from 'got';
// 工具函数
import { fnRoute, fnField, fnSchema } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '微信登录二维码',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                let weixinAccessToken = await fastify.redisGet('cacheData:weixinAccessToken');
                if (!weixinAccessToken) {
                    const result = await got('https://api.weixin.qq.com/cgi-bin/token', {
                        method: 'GET',
                        searchParams: {
                            grant_type: 'client_credential',
                            appid: appConfig.custom.weixin.appId,
                            secret: appConfig.custom.weixin.appSecret
                        }
                    }).json();

                    // 如果报错
                    if (result.errcode) {
                        return {
                            ...codeConfig.FAIL,
                            msg: result.errmsg
                        };
                    }
                    weixinAccessToken = result.access_token;
                    fastify.redisSet(`cacheData:weixinAccessToken`, weixinAccessToken, 6000);
                }

                const scan_qrcode_uuid = fnUUID();

                const result = await got('https://api.weixin.qq.com/cgi-bin/qrcode/create', {
                    method: 'post',
                    searchParams: {
                        access_token: weixinAccessToken
                    },
                    json: {
                        expire_seconds: 604800,
                        action_name: 'QR_STR_SCENE',
                        action_info: {
                            scene: {
                                scene_str: `scan_qrcode_login#${scan_qrcode_uuid}`
                            }
                        }
                    }
                }).json();

                // 如果认证过期，则重新生成
                if (result.errcode === 40001) {
                    const result = await fastify.getWeixinAccessToken();
                    // 如果报错
                    if (result.errcode) {
                        return {
                            ...codeConfig.FAIL,
                            msg: result.errmsg
                        };
                    }
                    weixinAccessToken = result.access_token;
                    fastify.redisSet(`cacheData:weixinAccessToken`, weixinAccessToken, 6000);
                }
                return {
                    ...codeConfig.SUCCESS,
                    data: {
                        url: result.url,
                        scan_qrcode_uuid: scan_qrcode_uuid
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
};
