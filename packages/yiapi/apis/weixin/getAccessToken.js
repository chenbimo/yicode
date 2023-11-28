// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '获取访问令牌',
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
                const cacheWeixinAccessToken = await fastify.redisGet('cacheData:weixinAccessToken');
                if (cacheWeixinAccessToken) {
                    return {
                        ...codeConfig.SUCCESS,
                        data: {
                            accessToken: cacheWeixinAccessToken,
                            from: 'cache'
                        }
                    };
                }
                const access_token = await fastify.getWeixinAccessToken();

                if (access_token) {
                    return {
                        ...codeConfig.SUCCESS,
                        data: access_token
                    };
                }
                return codeConfig.FAIL;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
};
