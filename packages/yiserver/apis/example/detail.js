import { fnRoute } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/http.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.id
            },
            required: ['id']
        },

        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const newsModel = fastify.mysql.table('news');

                const result = await newsModel //
                    .clone()
                    .where({ id: req.body.id })
                    .selectOne();

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
