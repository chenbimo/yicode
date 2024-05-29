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
                id: fnSchema(schemaHelperConfig.id)
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
