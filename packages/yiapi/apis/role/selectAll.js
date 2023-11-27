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
        apiName: '查询所有角色',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const roleModel = fastify.mysql //
                    .table('sys_role')
                    .modify(function (qb) {
                        // 如果不是开发管理员查询，则排除掉开发角色
                        if (req.session.role_codes !== 'dev') {
                            qb.where('code', '<>', 'dev');
                        }
                    });

                const rows = await roleModel.clone().selectAll(fnField('./tables/role.json'));

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
