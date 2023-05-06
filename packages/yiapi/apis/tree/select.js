import { fnSchema, fnApiInfo, fnPageOffset } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}接口`,
        type: 'object',
        properties: {
            page: fnSchema(sysConfig.schemaField.page, '第几页'),
            limit: fnSchema(sysConfig.schemaField.limit, '每页数量'),
            category: fnSchema(null, '分类代号', 'string', 1, 20, null)
        }
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        config: {},
        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(appConfig.table.sys_tree)
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
                    ...appConfig.httpCode.SELECT_SUCCESS,
                    data: {
                        total: total,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.SELECT_FAIL;
            }
        }
    });
}
