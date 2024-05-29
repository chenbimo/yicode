import got from 'got';
// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnParamsRaw } from '../../utils/fnParamsRaw.js';
import { fnHashSign } from '../../utils/fnHashSign.js';
import { fnUUID } from '../../utils/fnUUID.js';
// 配置文件
import { appConfig } from '../../config/app.js';
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                url: metaConfig.page_url
            },
            required: ['url']
        },
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
                    ...httpConfig.SUCCESS,
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
                return httpConfig.FAIL;
            }
        }
    });
};
