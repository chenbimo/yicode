// 外部函数
import { resolve } from 'path';
import { toDate, addDays, getTime } from 'date-fns';
import { yd_is_function, yd_data_findObj } from '@yicode/yidash';

// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnIncrUID } from '../../utils/fnIncrUID.js';
import { fnImportAbsolutePath } from '../../utils/fnImportAbsolutePath.js';
import { getCacheName } from '../../utils/getCacheName.js';
import { wxPayinit, wxPayVerifySign, wxPayDecodeCertificate, wxPayRequest } from '../../utils/wxPay.js';
// 配置文件
import { system } from '../../system.js';
import { appConfig } from '../../config/app.js';
import { paymentConfig } from '../../config/payment.js';
import { httpConfig } from '../../config/http.js';
// 接口元数据
import { metaConfig } from './_meta.js';

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
                // 交易失败
                if (req.body.event_type !== 'TRANSACTION.SUCCESS') {
                    fastify.log.error({
                        what: '交易失败',
                        ...req.body
                    });
                    return '';
                }
                // 支付初始化，必须放在验签前面
                await wxPayinit();

                // 验签失败
                const isVerifySignPass = wxPayVerifySign(req.headers, req.body);
                if (isVerifySignPass === false) {
                    fastify.log.error({
                        what: '验签失败',
                        ...req.body
                    });
                    return '';
                }
                const { callbackConfig } = await fnImportAbsolutePath(resolve(system.appDir, 'config', 'callback.js'), 'callbackConfig', {});
                // 解析数据
                const reply = JSON.parse(wxPayDecodeCertificate(req.body.resource));
                const attach = JSON.parse(reply.attach);
                const payOrderModel = fastify.mysql.table('sys_pay_order');

                // 判断订单是否存在
                const payOrderData = await payOrderModel //
                    .clone()
                    .where('order_no', reply.out_trade_no)
                    .selectOne(['id']);
                if (payOrderData?.id) {
                    fastify.log.error({
                        what: '订单已存在',
                        ...req.body
                    });
                    return '';
                }

                // 产品信息
                const paymentInfo = yd_data_findObj(paymentConfig, 'code', attach.pay_code);
                fastify.log.warn({ msg: '产品信息', ...paymentInfo });

                // 添加订单数据
                const insertData = {
                    user_id: attach.user_id,
                    user_openid: reply.payer.openid,
                    order_no: reply.out_trade_no,
                    transaction_id: reply.transaction_id,
                    pay_code: attach.pay_code,
                    pay_total: reply.amount.total,
                    buy_amount: attach.buy_amount,
                    product_code: paymentInfo.product || 0,
                    buy_duration: paymentInfo.duration || 0,
                    origin_price: paymentInfo.money || 0,
                    // buy_note: attach.buy_note,
                    buy_agent: attach.buy_agent || 0
                };
                if (appConfig.tablePrimaryKey === 'time') {
                    insertData.id = fnIncrUID();
                }
                fastify.log.warn({
                    what: '微信支付回调参数',
                    ...insertData
                });
                const redisKey = getCacheName(`payOrder_${attach.user_id}_${reply.out_trade_no}`);
                await fastify.redisSet(redisKey, 'yes', 6000);
                let result = await payOrderModel.clone().insertData(insertData);
                if (appConfig.tablePrimaryKey === 'default') {
                    insertData.id = result?.[0] || 0;
                }

                if (yd_is_function(callbackConfig.weixinPayNotify)) {
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
