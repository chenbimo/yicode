import got from 'got';
// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                accessToken: {
                    type: 'string',
                    minLength: 100,
                    maxLength: 1000,
                    title: 'accessToken'
                },
                code: {
                    type: 'string',
                    minLength: 10,
                    maxLength: 100,
                    title: 'code'
                }
            },
            required: ['code', 'accessToken']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const result = await got({
                    url: 'https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=' + req.body.accessToken,
                    json: {
                        code: req.body.code
                    }
                });
                if (result.data.errmsg === 'ok') {
                    return {
                        ...httpConfig.SUCCESS,
                        data: result.data.phone_info
                    };
                } else {
                    fastify.log.error(result.data);
                    return httpConfig.FAIL;
                }
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
