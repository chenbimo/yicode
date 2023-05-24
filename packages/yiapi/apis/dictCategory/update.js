import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(sysConfig.schemaField.id, '唯一ID'),
            code: fnSchema(sysConfig.schemaField.code, '字典分类编码'),
            name: fnSchema(null, '字典分类名称', 'string', 1, 20),
            describe: fnSchema(null, '字典分类描述', 'string', 0, 300),
            state: fnSchema(sysConfig.schemaField.state, '是否启用')
        },
        required: ['id', 'code']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                let dictCategoryModel = trx.table('sys_dict_category').modify(function (queryBuilder) {});

                let currentData = await dictCategoryModel.clone().where({ code: fnCamelCase(req.body.code) });

                if (currentData) {
                    return {
                        ...appConfig.httpCode.INSERT_FAIL,
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
                    .update(fnClearUpdateData(updateData));

                await trx.commit();
                return appConfig.httpCode.UPDATE_SUCCESS;
            } catch (err) {
                await trx.rollback();
                fastify.log.error(err);
                return appConfig.httpCode.UPDATE_FAIL;
            }
        }
    });
}
