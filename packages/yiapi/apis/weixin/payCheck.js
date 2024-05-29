// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnField } from '../../utils/fnField.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                order_no: metaConfig.order_no
            },
            required: ['order_no']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const redisKey = `cacheData:payOrder_${req.session.id}_${req.body.order_no}`;
                const payOrderNo = await fastify.redisGet(redisKey);
                if (payOrderNo) {
                    await fastify.redis.del(redisKey);
                    return {
                        ...httpConfig.SUCCESS,
                        msg: '付款成功！',
                        data: {
                            result: 'yes'
                        }
                    };
                } else {
                    return {
                        ...httpConfig.SUCCESS,
                        msg: '付款中...',
                        data: {
                            result: 'no'
                        }
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
