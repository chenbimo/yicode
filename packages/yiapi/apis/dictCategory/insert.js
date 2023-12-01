// 工具函数
import { fnRoute, fnCamelCase } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '添加字典目录';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                code: metaConfig.schema.code,
                name: metaConfig.schema.name,
                describe: metaConfig.schema.describe
            },
            required: ['code', 'name']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictCategoryModel = fastify.mysql.table('sys_dict_category');

                const dictCategoryData = await dictCategoryModel
                    .clone()
                    .where({ code: fnCamelCase(req.body.code) })
                    .selectOne('id');

                if (dictCategoryData?.id) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '当前编号已存在'
                    };
                }

                const result = await dictCategoryModel.insertData({
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    describe: req.body.describe
                });

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
};
