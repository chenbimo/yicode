// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.id
            },
            required: ['id']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const adminModel = fastify.mysql //
                    .table('sys_admin')
                    .where({ id: req.body.id })
                    .modify(function (db) {});

                const adminData = await adminModel.clone().selectOne('id');
                if (!adminData?.id) {
                    return httpConfig.NO_DATA;
                }

                const result = await adminModel.deleteData();

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
