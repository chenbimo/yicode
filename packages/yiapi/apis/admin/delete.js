import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { httpCodeConfig } from '../../config/httpCodeConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);
export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除${metaConfig.name}`,
    body: {
        title: `删除${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(sysConfig.schemaField.id, '唯一ID')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql //
                    .table('sys_admin')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let result = await adminModel.delete();

                return {
                    ...httpCodeConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpCodeConfig.DELETE_FAIL;
            }
        }
    });
}
