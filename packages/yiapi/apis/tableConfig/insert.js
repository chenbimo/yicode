import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            name: fnSchema(schemaField.string1to50, '表名称'),
            code: fnSchema(schemaField.table_code, '表编码'),
            describe: fnSchema(schemaField.describe, '表描述'),
            value: fnSchema(schemaField.string1to10000, '表字段')
        },
        required: ['name', 'code', 'describe', 'value']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let tableConfigModel = fastify.mysql.table('sys_table_config');

                let currentData = await tableConfigModel
                    .clone()
                    .where({ code: fnCamelCase(req.body.code) })
                    .first();

                if (currentData) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '当前表编码已存在'
                    };
                }

                let data = {
                    name: req.body.name,
                    code: fnCamelCase(req.body.code),
                    describe: req.body.describe,
                    value: req.body.value
                };

                let result = await tableConfigModel.insert(fnClearInsertData(data));

                return {
                    ...codeConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
}
