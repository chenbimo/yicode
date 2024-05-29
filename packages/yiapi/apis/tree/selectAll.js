// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
// 数据表格
import { tableData } from '../../tables/tree.js';
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
                category: metaConfig.category
            },
            required: ['category']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const roleModel = fastify.mysql //
                    .table('sys_tree')
                    .where('category', req.body.category)
                    .modify(function (db) {});

                const rows = await roleModel.clone().selectAll(Object.keys(tableData));

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
