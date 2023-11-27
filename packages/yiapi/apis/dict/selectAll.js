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
        apiName: '查询所有字典',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                category_code: metaConfig.schema.category_code,
                state: metaConfig.schema.state
            }
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictModel = fastify.mysql
                    .table('sys_dict')
                    .where('category_code', req.body.category_code)
                    .modify(function (qb) {
                        if (req.body.state !== undefined) {
                            qb.where('state', req.body.state);
                        }
                    });
                const rowsTemp = await dictModel.clone().selectAll(fnSelectFields('./tables/dict.json'));

                const rows = rowsTemp?.map((item) => {
                    if (item.symbol === 'number') {
                        item.value = Number(item.value);
                    }
                    return item;
                });
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
