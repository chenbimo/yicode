// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { toCamelCase } from '../../utils/toCamelCase.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
import { tableData } from '../../tables/dictCategory.js';
// 接口元数据
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: fnSchema(schemaHelperConfig.page),
                code: fnSchema(tableData.code),
                name: fnSchema(tableData.name),
                describe: fnSchema(tableData.describe)
            },
            required: ['id', 'code']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictCategoryModel = fastify.mysql.table('sys_dict_category').modify(function (db) {});

                const dictCategoryData = await dictCategoryModel
                    .clone()
                    .where({ code: toCamelCase(req.body.code) })
                    .selectOne('id');

                if (dictCategory?.id) {
                    return {
                        ...httpConfig.INSERT_FAIL,
                        msg: '当前编号已存在'
                    };
                }

                const result = await dictCategoryModel //
                    .clone()
                    .where({ id: req.body.id })
                    .updateData({
                        code: toCamelCase(req.body.code),
                        name: req.body.name,
                        describe: req.body.describe
                    });

                return httpConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
