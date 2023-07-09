import { fnClearUpdateData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: metaConfig.schema.id,
            name: metaConfig.schema.name,
            code: metaConfig.schema.code,
            describe: metaConfig.schema.describe,
            value: metaConfig.schema.value,
            state: metaConfig.schema.state
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let tableConfigModel = fastify.mysql.table('sys_table_config').modify(function (queryBuilder) {});

                let currentData = await tableConfigModel.clone().where({ code: fnCamelCase(req.body.code) });

                if (currentData) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '当前编号已存在'
                    };
                }

                let updateData = {
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    describe: req.body.describe,
                    value: req.body.value,
                    state: req.body.state
                };

                let result = await tableConfigModel //
                    .clone()
                    .where({ id: req.body.id })
                    .update(fnClearUpdateData(updateData));

                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
