import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询${metaConfig.name}详情`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}详情接口`,
        type: 'object',
        properties: {
            code: fnSchema(null, '字典代号', 'string', 1, 20)
        },
        required: ['code']
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
                let dictionaryModel = fastify.mysql.table(mapTableConfig.sys_dictionary);

                let result = await dictionaryModel //
                    .clone()
                    .where('code', req.body.code)
                    .first();

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
