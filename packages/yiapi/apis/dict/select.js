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
                limit: metaConfig.limit,
                category_code: metaConfig.category_code
            },
            required: ['category_code']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictModel = fastify.mysql //
                    .table('sys_dict')
                    .where('category_code', req.body.category_code)
                    .modify(function (db) {
                        if (req.body.keyword !== undefined) {
                            db.where('name', 'like', `%${req.body.keyword}%`);
                        }
                    });

                // 记录总数
                const { totalCount } = await dictModel.clone().selectCount();

                // 记录列表
                const rowsTemp = await dictModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .selectData(req.body.page, req.body.limit, ...fnField('dict', 'core'));

                // 处理数字符号强制转换为数字值
                const rows = rowsTemp?.map((item) => {
                    if (item.symbol === 'number') {
                        item.value = Number(item.value);
                    }
                    return item;
                });

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
