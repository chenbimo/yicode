import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(schemaField.id, '唯一ID'),
            category_id: fnSchema(schemaField.min1, '字典分类ID'),
            category_code: fnSchema(schemaField.category, '字典分类编码'),
            code: fnSchema(schemaField.code, '字典编码'),
            name: fnSchema(null, '字典名称', 'string', 1, 20),
            value: fnSchema(null, '字典值', 'string', 0, 500),
            symbol: fnSchema(null, '字典符号', 'string', 0, 20, ['string', 'number']),
            thumbnail: fnSchema(schemaField.image, '字典缩略图'),
            describe: fnSchema(null, '字典描述', 'string', 0, 300),
            state: fnSchema(schemaField.state, '是否启用')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                if (req.body.type === 'number') {
                    if (Number.isNaN(Number(req.body.value)) === true) {
                        return {
                            ...codeConfig.UPDATE_FAIL,
                            msg: '字典值不是一个数字类型'
                        };
                    }
                }
                let dictModel = trx.table('sys_dict').modify(function (queryBuilder) {});

                let updateData = {
                    category_id: req.body.category_id,
                    category_code: fnCamelCase(req.body.category_code),
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    value: req.body.value,
                    symbol: req.body.symbol,
                    thumbnail: req.body.thumbnail,
                    describe: req.body.describe,
                    state: req.body.state
                };

                let result = await dictModel //
                    .clone()
                    .where({ id: req.body.id })
                    .update(fnClearUpdateData(updateData));

                await trx.commit();
                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                await trx.rollback();
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
