// 工具函数
import { fnRoute, fnField } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '查询所有树',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                category: metaConfig.schema.category
            },
            required: ['category']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const roleModel = fastify.mysql //
                    .table('sys_tree')
                    .where('category', req.body.category)
                    .modify(function (qb) {});

                const rows = await roleModel.clone().selectAll(...fnField('tree', 'core'));

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
};
