// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
// 数据表格
import { tableData } from '../../tables/dict.js';
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
                code: fnSchema(tableData.code)
            },
            required: ['code']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictModel = fastify.mysql.table('sys_dict');

                const result = await dictModel //
                    .clone()
                    .where('code', req.body.code)
                    .selectOne();

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
