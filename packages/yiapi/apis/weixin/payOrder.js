import got from 'got';
// 工具函数
import { fnRoute, fnField, fnSchema, fnIncrUID } from '../../utils/index.js';
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
                buy_amount: metaConfig.buy_amount,
                pay_product: metaConfig.pay_product
            },
            required: ['pay_product']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const payProduct = appConfig.custom.productInfo[req.body.pay_product];
                if (!payProduct?.code) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '支付产品错误'
                    };
                }
                if (!payProduct?.money) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '支付金额错误'
                    };
                }
                const pay_note = '常规支付';
                // 产品订单号
                const orderNo = fnIncrUID();
                const params = {
                    amount: 1,
                    user_id: req.session.id,
                    order_no: orderNo,
                    pay_product: payProduct?.code || 0,
                    pay_note: pay_note,
                    pay_duration: payProduct?.duration || 0
                };
                fastify.log.warn({ what: '创建支付二维码', ...params });
                let res = await fastify.wxpay.request('native', {
                    description: payProduct?.describe || '无描述',
                    out_trade_no: orderNo,
                    amount: {
                        total: payProduct.money
                    },
                    attach: JSON.stringify(params)
                });
                if (res.code_url) {
                    return {
                        ...httpConfig.SUCCESS,
                        data: {
                            pay_url: res.code_url,
                            order_no: orderNo,
                            pay_product: payProduct?.code || 0,
                            pay_note: pay_note,
                            pay_duration: payProduct?.duration || 0
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
