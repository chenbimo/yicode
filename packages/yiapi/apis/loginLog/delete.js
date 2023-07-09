import { fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除${metaConfig.name}`,
    body: {
        title: `删除${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: metaConfig.schema.id
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let loginLogModel = fastify.mysql.table('sys_login_log');

                let result = await loginLogModel.clone().where({ id: req.body.id }).delete();

                return {
                    ...codeConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.DELETE_FAIL;
            }
        }
    });
}
