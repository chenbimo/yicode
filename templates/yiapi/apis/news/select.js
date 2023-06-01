import * as yiapi from '@yicode/yiapi';

const apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询资讯列表`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        type: 'object',
        title: '查询资讯列表接口',
        properties: {
            category_id: yiapi.utils.fnSchema(yiapi.schemaField.pid, '资讯分类'),
            page: yiapi.utils.fnSchema(yiapi.schemaField.page, '第几页'),
            limit: yiapi.utils.fnSchema(yiapi.schemaField.limit, '每页数量'),
            keywords: yiapi.utils.fnSchema(yiapi.schemaField.keywords, '搜索关键字')
        },
        required: ['category_id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        config: {},
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                // 查询用户是否存在
                let newsCategoryModel = trx.table('news').modify(function (db) {
                    if (req.body.category_id > 0) {
                        db.where('category_id', req.body.category_id);
                    }
                });

                // 记录总数
                let { total } = await newsCategoryModel
                    .clone() //
                    .count('id', { as: 'total' })
                    .first();

                // 记录列表
                let rows = await newsCategoryModel
                    .clone() //
                    .orderBy('created_at', 'desc')
                    .offset(yiapi.utils.fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

                await trx.commit();
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
                await trx.rollback();
                return yiapi.codeConfig.SELECT_FAIL;
            }
        }
    });
}
