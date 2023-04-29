import { fnSchema, fnApiInfo, fnPageOffset } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}接口`,
        type: 'object',
        properties: {
            page: fnSchema(sysConfig.schemaField.page, '第几页'),
            limit: fnSchema(sysConfig.schemaField.limit, '每页数量'),
            state: fnSchema(sysConfig.schemaField.state, '是否开启'),
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
        config: {},
        handler: async function (req, res) {
            try {
                let dictionaryModel = fastify.mysql //
                    .table(appConfig.table.sys_dict)
                    .where('category', req.body.category)
                    .modify(function (queryBuilder) {
                        if (req.body.keywords !== undefined) {
                            queryBuilder.where('name', 'like', `%${req.body.keywords}%`);
                        }
                        if (req.body.state !== undefined) {
                            queryBuilder.where('state', req.body.state);
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
                    ...appConfig.httpCode.SELECT_SUCCESS,
                    data: {
                        total: total,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.SELECT_FAIL;
            }
        }
    });
}
