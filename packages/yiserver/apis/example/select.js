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
                page: fnSchema(schemaHelperConfig.page),
                limit: fnSchema(schemaHelperConfig.limit)
            },
            required: []
        },

        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const newsModel = fastify.mysql //
                    .table('news')
                    .modify(function (qb) {});

                // 记录总数
                const { totalCount } = await newsModel
                    .clone() //
                    .selectCount();

                // 记录列表
                const rows = await newsModel
                    .clone() //
                    .orderBy('created_at', 'desc')
                    .selectData(req.body.page, req.body.limit);

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        total: totalCount,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
