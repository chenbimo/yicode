import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
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
            id: fnSchema(sysConfig.schemaField.id, 'ID')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {},
        handler: async function (req, res) {
            try {
                let model = fastify.mysql.table(appConfig.table.sys_tree);

                let selectResult = await model.clone().where({ pid: req.body.id }).first();
                if (selectResult) {
                    return { ...appConfig.httpCode.FAIL, msg: '该树存在下级树，无法删除' };
                }

                let result = await model.clone().where({ id: req.body.id }).delete();

                await fastify.cacheTreeData();

                return {
                    ...appConfig.httpCode.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.DELETE_FAIL;
            }
        }
    });
}
