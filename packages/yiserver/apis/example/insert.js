// 工具函数
import { fnRoute, fnSchema } from '@yicode/yiapi/fn.js';
// 配置文件
import { httpConfig } from '@yicode/yiapi/config/http.js';
import { schemaHelperConfig } from '@yicode/yiapi/config/schemaHelper.js';
// 数据库表
import { tableData } from '../../tables/example.js';
// 接口元数据
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                nickname: fnSchema(tableData.nickname),
                age: fnSchema(tableData.age)
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
