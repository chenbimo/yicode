// 工具函数
import { fnRoute, fnParamsRaw, fnHashSign, fnUUID } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                url: {
                    title: '页面 URL',
                    type: 'string'
                }
            },
            required: ['url']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const cacheWeixinJsapiTicket = await fastify.redisGet('cacheData:weixinJsapiTicket');
                if (cacheWeixinJsapiTicket) {
                    return {
                        ...httpConfig.SUCCESS,
                        data: {
                            jsapiTicket: cacheWeixinJsapiTicket,
                            from: 'cache'
                        }
                    };
                }

                const jsapi_ticket = await fastify.getWeixinJsapiTicket();

                // 如果报错
                if (jsapi_ticket) {
                    return {
                        ...httpConfig.SUCCESS,
                        data: jsapi_ticket
                    };
                }

                return httpConfig.FAIL;
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
