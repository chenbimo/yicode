// 工具函数
import { fnDbUpdateData, fnApiInfo, fnCamelCase } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
const apiInfo = await fnApiInfo(import.meta.url);
// 传参验证
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
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                const dictCategoryModel = fastify.mysql.table('sys_dict_category').modify(function (queryBuilder) {});

                const dictCategoryData = await dictCategoryModel
                    .clone()
                    .where({ code: fnCamelCase(req.body.code) })
                    .first('id');

                if (dictCategory?.id) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '当前编号已存在'
                    };
                }

                const updateData = {
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    describe: req.body.describe,
                    state: req.body.state
                };

                const result = await dictCategoryModel //
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
