import got from 'got';
// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnField } from '../../utils/fnField.js';
// 配置文件
import { appConfig } from '../../config/app.js';
import { httpConfig } from '../../config/http.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 100,
                    title: 'code'
                }
            },
            required: ['code']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const result = await got({
                    method: 'GET',
                    url: 'https://api.weixin.qq.com/sns/jscode2session',
                    searchParams: {
                        appid: appConfig.custom.weixin.appId,
                        secret: appConfig.custom.weixin.appSecret,
                        grant_type: 'authorization_code',
                        js_code: req.body.code
                    }
                });
                return {
                    ...httpConfig.SUCCESS,
                    data: result.data
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
