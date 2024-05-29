// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnField } from '../../utils/fnField.js';
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
                page: metaConfig.page,
                limit: metaConfig.limit
            },
            required: []
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const mailLogModel = fastify.mysql //
                    .table('sys_mail_log')
                    .modify(function (db) {
                        if (req.body.keyword !== undefined) {
                            db.where('nickname', 'like', `%${req.body.keyword}%`);
                        }
                    });

                // 记录总数
                const { totalCount } = await mailLogModel.clone().selectCount();

                // 记录列表
                const rows = await mailLogModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .selectData(req.body.page, req.body.limit, ...fnField('mailLog', 'core'));

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
