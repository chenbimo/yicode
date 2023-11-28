import got from 'got';
// 工具函数
import { fnRoute, fnParamsRaw, fnHashSign, fnUUID } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '获取 jsapiPay 配置',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                url: {
                    title: '页面 URL',
                    type: 'string'
                }
            },
            required: ['url']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                // 票据
                const jsapi_ticket = await fastify.getWeixinJsapiTicket();
                // 随机值
                const nonceStr = fnUUID();
                // 时间戳
                const timestamp = parseInt(new Date().getTime() / 1000) + '';
                // 参数
                const params = {
                    jsapi_ticket: jsapi_ticket,
                    nonceStr: nonceStr,
                    timestamp: timestamp,
                    url: req.body.url,
                    jsApiList: [
                        //
                        'chooseWXPay',
                        'getBrandWCPayRequest',
                        'checkJsApi',
                        'getLocation',
                        'chooseImage'
                    ]
                };
                // 签名
                const signature = fnHashSign('sha1', fnParamsRaw(params));
                // 返回数据
                return {
                    ...codeConfig.SUCCESS,
                    data: {
                        appId: appConfig.custom.weixin.appId,
                        signature: signature,
                        nonceStr: nonceStr,
                        timestamp: timestamp,
                        url: req.body.url
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
};
