// 工具函数
import { fnDbInsertData, fnApiInfo, fnCamelCase } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 传参校验
export let apiSchema = {
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
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let dictCategoryModel = fastify.mysql.table('sys_dict_category');

                let dictCategoryData = await dictCategoryModel
                    .clone()
                    .where({ code: fnCamelCase(req.body.code) })
                    .first('id');

                if (dictCategoryData?.id) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '当前编号已存在'
                    };
                }

                let insertData = {
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    describe: req.body.describe
                };

                let result = await dictCategoryModel.insert(fnDbInsertData(insertData));

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
