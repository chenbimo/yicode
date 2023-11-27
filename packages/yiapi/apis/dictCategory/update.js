// 工具函数
import { fnRoute, fnCamelCase } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '更新字典目录',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.schema.id,
                code: metaConfig.schema.code,
                name: metaConfig.schema.name,
                describe: metaConfig.schema.describe,
                state: metaConfig.schema.state
            },
            required: ['id', 'code']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictCategoryModel = fastify.mysql.table('sys_dict_category').modify(function (qb) {});

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

                const result = await dictCategoryModel //
                    .clone()
                    .where({ id: req.body.id })
                    .updateData({
                        code: fnCamelCase(req.body.code),
                        name: req.body.name,
                        describe: req.body.describe,
                        state: req.body.state
                    });

                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
};
