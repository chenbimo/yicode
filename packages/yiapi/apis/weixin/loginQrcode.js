import got from 'got';
// 工具函数
import { fnRoute, fnField, fnSchema, fnUUID } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '微信登录二维码';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                gong_zhong_hao: metaConfig.gong_zhong_hao,
                agent_id: metaConfig.agent_id,
                from_product: metaConfig.from_product
            },
            required: ['gong_zhong_hao']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                if (!appConfig.weixin.gongZhong[req.body.gong_zhong_hao]) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '公众号appId未配置'
                    };
                }
                const weixinAccessToken = await fastify.getWeixinAccessToken(req.body.gong_zhong_hao);
                if (!weixinAccessToken) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '获取访问令牌失败'
                    };
                }

                const scan_qrcode_uuid = fnUUID();
                const agent_id = req.body.agent_id;
                const from_product = req.body.from_product;

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
                                scene_str: `scan_qrcode_login#${scan_qrcode_uuid}#${agent_id}#${from_product}`
                            }
                        }
                    }
                }).json();

                // 如果报错
                if (result.errcode) {
                    return {
                        ...httpConfig.FAIL,
                        msg: result?.errmsg || ''
                    };
                }

                return {
                    ...httpConfig.SUCCESS,
                    data: {
                        url: result.url,
                        scan_qrcode_uuid: scan_qrcode_uuid
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
