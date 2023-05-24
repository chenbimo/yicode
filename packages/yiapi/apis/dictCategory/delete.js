import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
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
                let dictCategoryModel = fastify.mysql //
                    .table('sys_dict_category')
                    .where({ id: req.body.id });

                let dictModel = fastify.mysql.table('sys_dict');

                let dictCategoryData = await dictCategoryModel.clone().first();

                if (!dictCategoryData) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '查无此字典分类'
                    };
                }

                let childrenDict = await dictModel.clone().where({ category_id: req.body.id }).first();
                if (childrenDict) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '此分类下有字典，无法删除'
                    };
                }

                let result = await dictCategoryModel.clone().delete();
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
