import { fnRoute, fnField } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '添加资讯';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                title: metaConfig.title,
                thumbnail: metaConfig.thumbnail,
                content: metaConfig.content
            },
            required: ['title']
        },

        // 执行函数
        apiHandler: async (req, res) => {
            const trx = await fastify.mysql.transaction();
            try {
                const newsModel = trx('news');

                const result = await newsModel //
                    .clone()
                    .insertData({
                        title: req.body.title,
                        thumbnail: req.body.thumbnail,
                        content: req.body.content
                    });

                throw new Error('123');
                await trx.commit();
                return {
                    ...httpConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                await trx.rollback();
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
