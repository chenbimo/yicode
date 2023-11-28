import got from 'got';
// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '获取手机号信息',
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
        // 返回数据约束
        schemaResponse: {},
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
                        ...codeConfig.SUCCESS,
                        data: result.data.phone_info
                    };
                } else {
                    fastify.log.error(result.data);
                    return codeConfig.FAIL;
                }
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
};
