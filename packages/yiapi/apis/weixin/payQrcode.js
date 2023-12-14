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
                buy_product: metaConfig.buy_product,
                buy_duration: metaConfig.buy_duration,
                buy_note: metaConfig.buy_note
            },
            required: ['buy_amount', 'buy_product', 'buy_duration']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const productInfo = appConfig.product?.[req.body.buy_product]?.[req.body.buy_duration];
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
                    buy_product: productInfo?.buy_product || '',
                    buy_amount: req.body.buy_amount,
                    origin_price: productInfo?.money || '',
                    buy_duration: req.body.buy_duration,
                    buy_second: productInfo.duration,
                    buy_note: req.body.buy_note || '常规支付'
                };
                fastify.log.warn({
                    what: '创建支付二维码',
                    ...params
                });
                const res = await fastify.wxpay.request('native', {
                    description: productInfo?.describe || '无描述',
                    out_trade_no: orderNo,
                    amount: {
                        total: (productInfo.money * req.body.buy_amount).toFixed(0)
                    },
                    attach: JSON.stringify(params)
                });
                if (res.code_url) {
                    return {
                        ...httpConfig.SUCCESS,
                        data: {
                            pay_url: res.code_url,
                            order_no: orderNo,
                            buy_amount: params.buy_amount,
                            buy_product: params.buy_product,
                            buy_duration: params.buy_duration,
                            buy_second: params.buy_second,
                            buy_note: params.buy_note,
                            origin_price: params.origin_price
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
