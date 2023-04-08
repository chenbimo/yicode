import { fnSchema, fnApiInfo, fnPageOffset } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询字典`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '查询字典接口',
        type: 'object',
        properties: {
            page: fnSchema(schemaConfig.page, '第几页'),
            limit: fnSchema(schemaConfig.limit, '每页数量'),
            category: fnSchema(null, '分类代号', 'string', 1, 20, null)
        },
        required: ['category']
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let dictionaryModel = fastify.mysql //
                    .table(mapTableConfig.sys_dictionary)
                    .where('category', req.body.category)
                    .modify(function (queryBuilder) {
                        if (req.body.keywords !== undefined) {
                            queryBuilder.where('name', 'like', `%${req.body.keywords}%`);
                        }
                    });

                // 记录总数
                let { total } = await dictionaryModel
                    //
                    .clone()
                    .count('id', { as: 'total' })
                    .first();

                // 记录列表
                let resultData = await dictionaryModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

                // 处理数字符号强制转换为数字值
                let rows = resultData.map((item) => {
                    if (item.symbol === 'number') {
                        item.value = Number(item.value);
                    }
                    return item;
                });

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: {
                        total: total,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
