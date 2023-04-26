import { fnSchema, fnApiInfo, fnPageOffset } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}接口`,
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
            isLogin: true
        },
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                let feedbackModel = trx //
                    .table(mapTableConfig.sys_feedback)
                    .leftJoin(`${mapTableConfig.sys_user}`, `${mapTableConfig.sys_feedback}.ask_id`, `${mapTableConfig.sys_user}.id`)
                    .modify(function (queryBuilder) {});

                let { total } = await feedbackModel.clone().count('*', { as: 'total' }).first();
                let rows = await feedbackModel //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select(
                        //
                        `${mapTableConfig.sys_feedback}.*`,
                        `${mapTableConfig.sys_user}.nickname`,
                        `${mapTableConfig.sys_user}.username`,
                        `${mapTableConfig.sys_user}.phone`
                    );
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
