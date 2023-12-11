// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '删除树';

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
                id: metaConfig.id
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
