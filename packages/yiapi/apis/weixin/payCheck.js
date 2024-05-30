// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { getCacheName } from '../../utils/getCacheName.js';
// 配置文件
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
                order_no: fnSchema(tableData.order_no)
            },
            required: ['order_no']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const redisKey = getCacheName(`payOrder_${req.session.id}_${req.body.order_no}`);
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
