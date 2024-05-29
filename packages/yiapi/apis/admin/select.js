// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { toOmit } from '../../utils/toOmit.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
import { tableData } from '../../tables/admin.js';
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
                page: fnSchema(schemaHelperConfig.page),
                limit: fnSchema(schemaHelperConfig.limit)
            }
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const adminModel = fastify.mysql //
                    .table('sys_admin')
                    .where('username', '<>', 'dev')
                    .modify((db) => {});

                const { totalCount } = await adminModel.clone().selectCount();
                const rows = await adminModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .selectData(req.body.page, req.body.limit, ...toOmit(Object, keys(tableData), ['password']));

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
