// 外部函数
import { yd_string_camelCase } from '@/yicode/yidash';
// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
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
                code: fnSchema(tableData.code),
                name: fnSchema(tableData.name),
                describe: fnSchema(tableData.describe)
            },
            required: ['code', 'name']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictCategoryModel = fastify.mysql.table('sys_dict_category');

                const dictCategoryData = await dictCategoryModel
                    .clone()
                    .where({ code: yd_string_camelCase(req.body.code) })
                    .selectOne(['id']);

                if (dictCategoryData?.id) {
                    return {
                        ...httpConfig.INSERT_FAIL,
                        msg: '当前编号已存在'
                    };
                }

                const result = await dictCategoryModel.insertData({
                    code: yd_string_camelCase(req.body.code),
                    name: req.body.name,
                    describe: req.body.describe
                });

                return {
                    ...httpConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
