import { fnApiInfo, fnPageOffset } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `查询${metaConfig.name}`,
    body: {
        title: `查询${metaConfig.name}接口`,
        type: 'object',
        properties: {
            page: metaConfig.schema.page,
            limit: metaConfig.schema.limit
        }
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql //
                    .table('sys_user')
                    .modify(function (queryBuilder) {
                        if (req.body.state !== undefined) {
                            queryBuilder.where('state', req.body.state);
                        }
                    });

                let { total } = await adminModel.clone().count('id', { as: 'total' }).first();
                let rows = await adminModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        total: total,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
