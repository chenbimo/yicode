import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询通知详情`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '查询通知详情接口',
        type: 'object',
        properties: {
            id: fnSchema(schemaConfig.id, '唯一ID')
        },
        required: ['id']
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
                let modelNotice = fastify.mysql //
                    .table(mapTableConfig.sys_notice);

                let result = await modelNotice //
                    .clone()
                    .where({ id: req.body.id })
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
