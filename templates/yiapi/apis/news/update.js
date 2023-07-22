import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

const apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新资讯`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        type: 'object',
        title: '更新资讯接口',
        properties: {
            id: metaConfig.schema.id,
            category_id: metaConfig.schema.category_id,
            title: metaConfig.schema.title,
            describe: metaConfig.schema.describe,
            thumbnail: metaConfig.schema.thumbnail,
            content: metaConfig.schema.content
        },
        required: [
            //
            'id'
        ]
    }
};

export default async function (fastify) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                let newsModel = trx.table('news').where('id', req.body.id);

                let updateData = {
                    category_id: req.body.category_id,
                    title: req.body.title,
                    describe: req.body.describe,
                    thumbnail: req.body.thumbnail,
                    content: req.body.content
                };

                let result = await newsModel.clone().update(yiapi.utils.fnDbUpdateData(updateData));

                await trx.commit();
                return {
                    ...yiapi.codeConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                await trx.rollback();
                // 成功返回
                return yiapi.codeConfig.INSERT_FAIL;
            }
        }
    });
}
