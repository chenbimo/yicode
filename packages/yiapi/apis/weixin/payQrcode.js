import got from 'got';
import { find } from 'lodash-es';
// 工具函数
import { fnRoute, fnField, fnSchema, fnIncrUID } from '../../utils/index.js';
import { wxPayinit, wxPayVerifySign, wxPayDecodeCertificate, wxPayRequest } from '../../utils/wxPay.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '创建微信支付订单';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                pay_code: metaConfig.pay_code,
                buy_amount: metaConfig.buy_amount,
                buy_note: metaConfig.buy_note
            },
            required: ['buy_amount', 'pay_code']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const productInfo = find(appConfig.payment, { code: req.body.pay_code });
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
                    buy_note: req.body.buy_note || '常规支付'
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
                if (res.code_url) {
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
