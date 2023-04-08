import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除通知`,
    description: `${apiInfo.apiPath}`,
    body: {
        title: '删除通知接口',
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
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let noticeModel = fastify.mysql //
                    .table(mapTableConfig.sys_notice)
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let result = await noticeModel.delete();
                return {
                    ...constantConfig.code.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.DELETE_FAIL;
            }
        }
    });
}
