import { fnRoute, fnSchema } from '@yicode/yiapi/fn.js';
import { httpConfig } from '@yicode/yiapi/config/http.js';
import { schemaHelperConfig } from '@yicode/yiapi/config/schemaHelper.js';
import { metaConfig } from './_meta.js';
import { tableData } from '../../tables/example.js';

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
                const newsModel = fastify.mysql //
                    .table('news')
                    .modify(function (qb) {});

                const result = await newsModel.clone().where('id', req.body.id).deleteData();

                return {
                    ...httpConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
