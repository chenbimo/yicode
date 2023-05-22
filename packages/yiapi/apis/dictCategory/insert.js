import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            code: fnSchema(sysConfig.schemaField.code, '字典分类编码'),
            name: fnSchema(null, '字典分类名称', 'string', 1, 20),
            describe: fnSchema(null, '字典分类描述', 'string', 0, 300)
        },
        required: ['code', 'name']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let dictCategoryModel = fastify.mysql.table(appConfig.table.sys_dict_category);

                let data = {
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    describe: req.body.describe
                };

                let result = await dictCategoryModel.insert(fnClearInsertData(data));

                return {
                    ...appConfig.httpCode.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.INSERT_FAIL;
            }
        }
    });
}
