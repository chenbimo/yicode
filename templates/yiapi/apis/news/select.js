import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

const apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询资讯列表`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        type: 'object',
        title: '查询资讯列表接口',
        properties: {
            category_id: metaConfig.schema.category_id,
            page: metaConfig.schema.page,
            limit: metaConfig.schema.limit,
            keyword: metaConfig.schema.keyword
        },
        required: ['category_id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                // 查询用户是否存在
                const newsModel = fastify.mysql.table('news').modify(function (db) {
                    if (req.body.category_id > 0) {
                        db.where('category_id', req.body.category_id);
                    }
                });

                // 记录总数
                const { total } = await newsModel
                    .clone() //
                    .count('id', { as: 'total' })
                    .first('id');

                // 记录列表
                const rows = await newsModel
                    .clone() //
                    .orderBy('created_at', 'desc')
                    .offset(yiapi.utils.fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

                return {
                    ...yiapi.codeConfig.SELECT_SUCCESS,
                    data: {
                        total: total,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return yiapi.codeConfig.SELECT_FAIL;
            }
        }
    });
}
