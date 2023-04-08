import { fnSchema, fnApiInfo, fnPageOffset } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询通知`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '查询通知接口',
        type: 'object',
        properties: {
            page: fnSchema(schemaConfig.page, '第几页'),
            limit: fnSchema(schemaConfig.limit, '每页数量'),
            keywords: fnSchema(schemaConfig.keywords, '搜索关键字')
        }
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                let noticeModel = trx //
                    .table(mapTableConfig.sys_notice)
                    .modify(function (queryBuilder) {
                        if (req.body.keywords) {
                            queryBuilder.where('title', 'like', `%${req.body.keywords}%`);
                        }
                    });

                // 记录总数
                let { total } = await noticeModel //
                    .clone()
                    .count('id', { as: 'total' })
                    .first();

                // 记录列表
                let rows = await noticeModel //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

                await trx.commit();
                return {
                    ...constantConfig.code.SELECT_SUCCESS,
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
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
