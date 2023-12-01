// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '删除树',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.schema.id
            },
            required: ['id']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const treeModel = fastify.mysql.table('sys_tree');

                const treeData = await treeModel //
                    .clone()
                    .where({ pid: req.body.id })
                    .selectOne('id');

                if (treeData?.id) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '该树存在下级树，无法删除'
                    };
                }

                const result = await treeModel //
                    .clone()
                    .where({ id: req.body.id })
                    .deleteData();

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
};
