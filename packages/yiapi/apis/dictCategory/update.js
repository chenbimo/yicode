import { fnDbUpdateData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

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
            code: metaConfig.schema.code,
            name: metaConfig.schema.name,
            describe: metaConfig.schema.describe,
            state: metaConfig.schema.state
        },
        required: ['id', 'code']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let dictCategoryModel = fastify.mysql.table('sys_dict_category').modify(function (queryBuilder) {});

                let currentData = await dictCategoryModel.clone().where({ code: fnCamelCase(req.body.code) });

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
                    state: req.body.state
                };

                let result = await dictCategoryModel //
                    .clone()
                    .where({ id: req.body.id })
                    .update(fnDbUpdateData(updateData));

                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
