// 工具函数
import { fnRoute, fnField } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '查询角色';

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
                page: metaConfig.page,
                limit: metaConfig.limit,
                keyword: metaConfig.keyword
            },
            required: []
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const roleModel = fastify.mysql //
                    .table('sys_role')
                    .modify(function (qb) {
                        if (req.session !== 'dev') {
                            qb.where('code', '<>', 'dev');
                        }
                    });

                const { totalCount } = await roleModel.clone().selectCount();
                const rows = await roleModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .selectData(req.body.page, req.body.limit, ...fnField('role', 'core'));

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        total: totalCount,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
