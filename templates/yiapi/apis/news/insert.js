import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

export const apiName = '添加资讯';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    yiapi.fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                title: metaConfig.schema.title,
                thumbnail: metaConfig.schema.thumbnail,
                content: metaConfig.schema.content
            },
            required: ['title']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const newsModel = fastify.mysql.table('news');

                const result = await newsModel //
                    .clone()
                    .insertData({
                        title: req.body.title,
                        thumbnail: req.body.thumbnail,
                        content: req.body.content
                    });

                return {
                    ...yiapi.httpConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.httpConfig.INSERT_FAIL;
            }
        }
    });
};
