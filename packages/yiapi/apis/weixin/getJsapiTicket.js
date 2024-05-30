// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnApiRaw } from '../../utils/fnApiRaw.js';
import { fnHashSign } from '../../utils/fnHashSign.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { cacheConfig } from '../../config/cache.js';
// 接口元数据
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                url: fnSchema({ name: '页面路径', schema: { type: 'string' } })
            },
            required: ['url']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const cacheWeixinJsapiTicket = await fastify.redisGet(cacheConfig.weixinJsapiTicket);
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
