import { fnClearInsertData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            code: metaConfig.schema.code,
            name: metaConfig.schema.name,
            describe: metaConfig.schema.describe
        },
        required: ['code', 'name']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let dictCategoryModel = fastify.mysql.table('sys_dict_category');

                let currentData = await dictCategoryModel
                    .clone()
                    .where({ code: fnCamelCase(req.body.code) })
                    .first();

                if (currentData) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '当前编号已存在'
                    };
                }

                let data = {
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    describe: req.body.describe
                };

                let result = await dictCategoryModel.insert(fnClearInsertData(data));

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
