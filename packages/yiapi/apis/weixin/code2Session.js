import got from 'got';
// 工具函数
import { fnRoute, fnField, fnSchema } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '通过 code 换取 session';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
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
        // 返回数据约束
        schemaResponse: {},
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
                    ...codeConfig.SUCCESS,
                    data: result.data
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
};
