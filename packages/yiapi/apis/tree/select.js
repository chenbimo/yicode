import { fnSchema, fnApiInfo, fnPageOffset } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询反馈`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '查询反馈接口',
        type: 'object',
        properties: {
            page: fnSchema(schemaConfig.page, '第几页'),
            limit: fnSchema(schemaConfig.limit, '每页数量'),
            category: fnSchema(null, '分类代号', 'string', 1, 20, null)
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
            try {
                let model = fastify.mysql //
                    .table(mapTableConfig.sys_tree)
                    .where('category', req.body.category)
                    .modify(function (queryBuilder) {});

                let { total } = await model.clone().count('id', { as: 'total' }).first();

                let rows = await model
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

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
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
