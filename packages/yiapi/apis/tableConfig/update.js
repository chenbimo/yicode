import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(schemaField.id, '唯一ID'),
            name: fnSchema(schemaField.string1to50, '表名称'),
            code: fnSchema(schemaField.table_code, '表编码'),
            describe: fnSchema(schemaField.describe, '表描述'),
            value: fnSchema(schemaField.string1to10000, '表字段'),
            state: fnSchema(schemaField.state, '是否启用')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                let tableConfigModel = trx.table('sys_table_config').modify(function (queryBuilder) {});

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

                await trx.commit();
                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                await trx.rollback();
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
