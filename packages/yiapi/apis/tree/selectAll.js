import { fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { cacheData } from '../../config/cacheData.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询所有${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询所有${metaConfig.name}接口`,
        type: 'object',
        properties: {
            category: metaConfig.schema.category
        },
        required: ['category']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                // TODO: 优化，不同分类的目录独立的缓存
                let treeData = await fastify.redisGet(cacheData.tree);
                let rows = treeData.filter((item) => item.category === req.body.category);
                // let model = fastify.mysql //
                //     .table('sys_tree')
                //     .where('type', req.body.type)
                //     .modify(function (queryBuilder) {});

                // let rows = await model.clone().orderBy('sort', 'asc').select();

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
}
