import { toDate, addDays, getTime } from 'date-fns';

// 工具函数
import { fnRoute, fnField, fnSchema, fnIncrUID } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '微信支付回调';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
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
                // 交易失败
                if (req.body.event_type !== 'TRANSACTION.SUCCESS') {
                    fastify.log.error({
                        what: '交易失败',
                        ...req.body
                    });
                    return '';
                }

                // 验签失败
                const isVerifySignPass = fastify.wxpay.verifySign(req.headers, req.body);
                if (isVerifySignPass === false) {
                    fastify.log.error({
                        what: '验签失败',
                        ...req.body
                    });
                    return '';
                }
                const { callbackConfig } = await fnImport(resolve(sysConfig.appDir, 'config', 'callback.js'), 'callbackConfig', {});
                // 解析数据
                const reply = JSON.parse(fastify.wxpay.decodeCertificate(req.body.resource));
                const attach = JSON.parse(reply.attach);
                const payOrderModel = fastify.mysql.table('pay_order');

                // 判断订单是否存在
                const payOrderData = await payOrderModel //
                    .clone()
                    .where('order_no', reply.out_trade_no)
                    .selectOne();
                if (payOrderData?.id) {
                    fastify.log.error({
                        what: '订单已存在',
                        ...req.body
                    });
                    return '';
                }

                // 添加订单数据
                const insertData = {
                    id: fnIncrUID(),
                    user_id: attach.user_id,
                    user_openid: reply.payer.openid,
                    order_no: reply.out_trade_no,
                    transaction_id: reply.transaction_id,
                    buy_product: attach.buy_product,
                    origin_price: attach.origin_price,
                    pay_total: reply.amount.total,
                    buy_amount: attach.buy_amount,
                    buy_duration: attach.buy_duration,
                    buy_second: attach.buy_second,
                    buy_note: attach.buy_note
                };
                fastify.log.warn({
                    what: '微信支付回调参数',
                    ...insertData
                });
                const redisKey = `cacheData:payOrder_${attach.user_id}_${reply.out_trade_no}`;
                await fastify.redisSet(redisKey, 'yes', 6000);
                await payOrderModel.clone().insertData(insertData);

                if (isFunction(callbackConfig.weixinMessage)) {
                    callbackConfig.weixinPayNotify(fastify, insertData);
                }

                return '';
            } catch (err) {
                fastify.log.error(err);
                res.statusCode = 406;
                return {
                    code: 'FAIL',
                    message: '微信支付回调失败'
                };
            }
        }
    });
};
