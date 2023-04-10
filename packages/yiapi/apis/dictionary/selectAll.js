import { fnApiInfo, fnSchema } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询所有轮播图`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '查询所有轮播图接口',
        type: 'object',
        properties: {
            category: fnSchema(null, '分类代号', 'string', 1, 20, null),
            state: fnSchema(schemaConfig.state, '是否开启')
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
                let dictionaryModel = fastify.mysql
                    .table(mapTableConfig.sys_dictionary)
                    .where('category', req.body.category)
                    .modify(function (queryBuilder) {
                        if (req.body.state !== undefined) {
                            queryBuilder.where('state', req.body.state);
                        }
                    });
                let resultData = await dictionaryModel.clone().select();

                let rows = resultData.map((item) => {
                    if (item.symbol === 'number') {
                        item.value = Number(item.value);
                    }
                    return item;
                });
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
