import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    yiapi.fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '更新资讯',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.schema.id,
                title: metaConfig.schema.title,
                thumbnail: metaConfig.schema.thumbnail,
                content: metaConfig.schema.content
            },
            required: ['id']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const newsModel = fastify.mysql.table('news');

                const result = await newsModel //
                    .clone()
                    .where('id', req.body.id)
                    .updateData({
                        title: req.body.title,
                        thumbnail: req.body.thumbnail,
                        content: req.body.content
                    });

                return {
                    ...yiapi.codeConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.INSERT_FAIL;
            }
        }
    });
};
