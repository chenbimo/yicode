import { fnApiInfo, fnPageOffset, fnSchema } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询轮播图`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '查询轮播图接口',
        type: 'object',
        properties: {
            page: fnSchema(schemaConfig.page, '第几页'),
            limit: fnSchema(schemaConfig.limit, '每页数量'),
            keywords: fnSchema(schemaConfig.keywords, '搜索关键字'),
            is_recommend: fnSchema(schemaConfig.boolEnum, '是否推荐')
        }
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
                let bannerModel = fastify.mysql //
                    .table(mapTableConfig.sys_banner)
                    .modify(function (queryBuilder) {
                        if (req.body.is_recommend !== undefined) {
                            queryBuilder.where('is_recommend', req.body.is_recommend);
                        }
                    });

                let { total } = await bannerModel //
                    .clone()
                    .count('id', { as: 'total' })
                    .first();

                let rows = await bannerModel //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select();

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
