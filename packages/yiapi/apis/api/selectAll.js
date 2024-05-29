// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const result = await fastify.redisGet('cacheData:api');

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        rows: result
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
