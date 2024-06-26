// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
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
                id: fnSchema(schemaHelperConfig.id)
            },
            required: ['id']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const treeModel = fastify.mysql.table('sys_tree');

                const treeData = await treeModel //
                    .clone()
                    .where({ pid: req.body.id })
                    .selectOne(['id']);

                if (treeData?.id) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '该树存在下级树，无法删除'
                    };
                }

                const result = await treeModel //
                    .clone()
                    .where({ id: req.body.id })
                    .deleteData();

                return {
                    ...httpConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.DELETE_FAIL;
            }
        }
    });
};
