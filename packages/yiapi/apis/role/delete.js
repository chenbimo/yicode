// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '删除角色';

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
                const roleModel = fastify.mysql //
                    .table('sys_role')
                    .where('id', req.body.id)
                    .modify(function (db) {});

                const roleData = await roleModel.clone().selectOne('id', 'is_system');
                if (!roleData?.id) {
                    return httpConfig.NO_DATA;
                }

                if (roleData.is_system === 1) {
                    return {
                        ...httpConfig.DELETE_FAIL,
                        msg: '默认角色，无法删除'
                    };
                }

                const result = await roleModel.clone().deleteData();

                // 生成新的权限
                await fastify.cacheRoleData();

                return {
                    ...httpConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                return httpConfig.DELETE_FAIL;
            }
        }
    });
};
