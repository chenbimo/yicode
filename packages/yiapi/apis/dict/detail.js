import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询${metaConfig.name}详情`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}详情接口`,
        type: 'object',
        properties: {
            code: fnSchema(sysConfig.schemaField.code, '字典编码')
        },
        required: ['code']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let dictModel = fastify.mysql.table('sys_dict');

                let result = await dictModel //
                    .clone()
                    .where('code', req.body.code)
                    .first();

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
