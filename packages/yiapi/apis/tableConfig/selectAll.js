import { fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询所有${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询所有${metaConfig.name}接口`,
        type: 'object',
        properties: {}
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let tableConfigModel = fastify.mysql //
                    .table('sys_table_config')
                    .modify(function (queryBuilder) {
                        if (req.body.state !== undefined) {
                            queryBuilder.where('state', req.body.state);
                        }
                    });

                let rows = await tableConfigModel.clone().select();

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
