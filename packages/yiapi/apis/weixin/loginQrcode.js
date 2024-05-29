import got from 'got';
// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnUUID } from '../../utils/fnUUID.js';
// 配置文件
import { appConfig } from '../../config/app.js';
import { httpConfig } from '../../config/http.js';
// 数据库表
import { tableData } from '../../tables/payOrder.js';
// 接口元数据
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                agent_id: fnSchema({ name: '代理ID', schema: { type: 'integer', min: 1 } }),
                product_code: fnSchema(tableData.product_code)
            },
            required: ['agent_id', 'product_code']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const weixinAccessToken = await fastify.getWeixinAccessToken();
                if (!weixinAccessToken) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '获取访问令牌失败'
                    };
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
                                scene_str: `scan_qrcode_login#${scan_qrcode_uuid}#${req.body.product_code}#${req.body.agent_id}`
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
