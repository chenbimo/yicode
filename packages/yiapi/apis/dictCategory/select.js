// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnField } from '../../utils/fnField.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                page: metaConfig.page,
                limit: metaConfig.limit
            },
            required: []
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictCategoryModel = fastify.mysql //
                    .table('sys_dict_category')
                    .modify(function (db) {
                        if (req.body.keyword !== undefined) {
                            db.where('name', 'like', `%${req.body.keyword}%`);
                        }
                    });

                // 记录总数
                const { totalCount } = await dictCategoryModel.clone().selectCount();

                // 记录列表
                const rows = await dictCategoryModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .selectData(req.body.page, req.body.limit, ...fnField('dictCategory', 'core'));

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
