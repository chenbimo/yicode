// 工具函数
import { fnRoute, fnField, fnSchema } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '支付结果检测',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                order_no: metaConfig.schema.order_no
            },
            required: ['order_no']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const redisKey = `cacheData:payOrder_${req.session.id}_${req.body.order_no}`;
                const payOrderNo = await fastify.redisGet(redisKey);
                if (payOrderNo) {
                    await fastify.redis.del(redisKey);
                    return {
                        ...codeConfig.SUCCESS,
                        msg: '付款成功！',
                        data: {
                            result: 'yes'
                        }
                    };
                } else {
                    return {
                        ...codeConfig.SUCCESS,
                        msg: '付款中...',
                        data: {
                            result: 'no'
                        }
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
};
