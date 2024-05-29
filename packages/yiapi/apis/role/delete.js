// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
import { tableData } from '../../tables/role.js';
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
                id: fnSchema(tableData.code)
            },
            required: ['id']
        },
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
