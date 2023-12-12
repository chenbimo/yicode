import got from 'got';
// 工具函数
import { fnRoute, fnParamsRaw, fnHashSign, fnUUID } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '获取 jsapiPay 配置';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                url: metaConfig.page_url,
                gong_zhong_hao: metaConfig.gong_zhong_hao
            },
            required: ['url', 'gong_zhong_hao']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                if (!appConfig.weixin.gongZhong[req.body.gong_zhong_hao]) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '公众号appId未配置'
                    };
                }
                // 票据
                const jsapi_ticket = await fastify.getWeixinJsapiTicket(req.body.gong_zhong_hao);
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
