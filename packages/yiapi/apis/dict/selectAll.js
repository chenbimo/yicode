// 工具函数
import { fnRoute, fnField } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '查询所有字典';

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
                category_code: metaConfig.category_code
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
                    .modify(function (db) {});
                const rowsTemp = await dictModel.clone().selectAll(...fnField('dict', 'core'));

                const rows = rowsTemp?.map((item) => {
                    if (item.symbol === 'number') {
                        item.value = Number(item.value);
                    }
                    return item;
                });
                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
