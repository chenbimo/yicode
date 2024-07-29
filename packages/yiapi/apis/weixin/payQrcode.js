import got from 'got';
import { yd_data_findObj } from '@yicode/yidash';
// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnIncrUID } from '../../utils/fnIncrUID.js';
import { wxPayinit, wxPayVerifySign, wxPayDecodeCertificate, wxPayRequest } from '../../utils/wxPay.js';
// 配置文件
import { appConfig } from '../../config/app.js';
import { paymentConfig } from '../../config/payment.js';
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
                pay_code: fnSchema(tableData.pay_code),
                buy_amount: fnSchema(tableData.buy_amount),
                buy_note: fnSchema(tableData.buy_note),
                buy_agent: fnSchema({ name: '邀请人', type: 'bigInt', min: 0 })
            },
            required: ['buy_amount', 'pay_code']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const productInfo = yd_data_findObj(paymentConfig, 'code', req.body.pay_code);
                if (!productInfo?.name) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '支付产品信息有误'
                    };
                }
                if (!productInfo?.money) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '产品支付金额错误'
                    };
                }
                // 产品订单号
                const orderNo = fnIncrUID();
                const params = {
                    order_no: orderNo,
                    user_id: req.session.id,
                    pay_code: req.body.pay_code,
                    buy_amount: req.body.buy_amount,
                    // buy_note: req.body.buy_note || '常规支付2',
                    buy_agent: req.body.buy_agent || 0
                };
                fastify.log.warn({
                    what: '创建支付二维码',
                    ...params
                });

                const attachStringify = JSON.stringify(params);
                if (attachStringify.length > 128) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '微信支付 attach 参数长度不能大于 128 个字符'
                    };
                }

                const res = await wxPayRequest('native', {
                    description: productInfo?.name || '无',
                    out_trade_no: orderNo,
                    amount: {
                        total: Number((productInfo.money * req.body.buy_amount).toFixed(0))
                    },
                    attach: attachStringify
                });
                if (res?.code_url) {
                    return {
                        ...httpConfig.SUCCESS,
                        data: {
                            pay_url: res.code_url,
                            order_no: orderNo
                        }
                    };
                } else {
                    fastify.log.error(res);
                    return httpConfig.FAIL;
                }
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
