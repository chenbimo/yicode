import { fnSchema, fnApiInfo, fnPageOffset } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
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
            keywords: fnSchema(sysConfig.schemaField.keywords, '搜索关键字')
        }
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let roleModel = fastify.mysql //
                    .table('sys_role')
                    .modify(function (queryBuilder) {
                        if (req.session !== 'dev') {
                            queryBuilder.where('code', '<>', 'dev');
                        }
                    });

                let { total } = await roleModel.clone().count('id', { as: 'total' }).first();
                let rows = await roleModel
                    .clone()
                    //
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
