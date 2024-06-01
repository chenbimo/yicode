// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
// 接口元数据
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const result = await fastify.getUserApis(req.session);
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
