import { fnApiInfo, fnSchema } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { cacheConfig } from '../../config/cache.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询所有${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询所有${metaConfig.name}接口`,
        type: 'object',
        properties: {
            category: fnSchema(schemaConfig.category, '目录分类')
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
                // TODO: 优化，不同分类的目录独立的缓存
                let treeData = await fastify.redisGet(cacheConfig.cacheData_tree, 'json');
                let rows = treeData.filter((item) => item.category === req.body.category);
                // let model = fastify.mysql //
                //     .table(mapTableConfig.sys_tree)
                //     .where('type', req.body.type)
                //     .modify(function (queryBuilder) {});

                // let rows = await model.clone().orderBy('sort', 'asc').select();

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
