import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);
export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除管理员`,
    description: `${apiInfo.apiPath}`,
    body: {
        title: '删除管理员接口',
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
                let adminModel = fastify.mysql //
                    .table(mapTableConfig.sys_admin)
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let result = await adminModel.delete();

                return {
                    ...constantConfig.code.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.INSERT_FAIL;
            }
        }
    });
}
