// 工具函数
import { fnRoute, fnSelectFields } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '查询登录日志',
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
                const loginLogModel = fastify.mysql //
                    .table('sys_login_log')
                    .modify(function (queryBuilder) {
                        if (req.body.keyword !== undefined) {
                            queryBuilder.where('nickname', 'like', `%${req.body.keyword}%`);
                        }
                    });

                // 记录总数
                const { totalCount } = await loginLogModel.clone().selectOne();

                // 记录列表
                const rows = await loginLogModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .select(req.body.page, req.body.limit, fnSelectFields('./tables/loginLog.json'));

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
