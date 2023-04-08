import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `增加通知浏览量`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '增加通知浏览量接口',
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
                    .where({ id: req.body.id });

                let result = await noticeModel.increment({ views: 1 });

                return {
                    ...constantConfig.code.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
