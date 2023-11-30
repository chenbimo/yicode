// 工具函数
import { fnRoute, fnField } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '查询用户列表',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                page: metaConfig.schema.page,
                limit: metaConfig.schema.limit
            },
            required: []
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const sysUserModel = fastify.mysql //
                    .table('sys_user')
                    .modify(function (qb) {
                        if (req.body.state !== undefined) {
                            qb.where('state', req.body.state);
                        }
                    });

                const { totalCount } = await sysUserModel.clone().selectCount();
                const rows = await sysUserModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .select(req.body.page, req.body.limit, ...fnField('user', 'core', ['password']));

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        total: totalCount,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
};
