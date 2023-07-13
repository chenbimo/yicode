import * as yiapi from '@yicode/yiapi';
import { metaConfig } from './_meta.js';

const apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加资讯`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        type: 'object',
        title: '添加资讯接口',
        properties: {
            category_id: metaConfig.schema.category_id,
            title: metaConfig.schema.title,
            describe: metaConfig.schema.describe,
            thumbnail: metaConfig.schema.thumbnail,
            content: metaConfig.schema.content
        },
        required: [
            //
            'category_id',
            'title'
        ]
    }
};

export default async function (fastify) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                let newsModel = trx.table('news');

                let insertData = {
                    category_id: req.body.category_id,
                    title: req.body.title,
                    describe: req.body.describe,
                    thumbnail: req.body.thumbnail,
                    content: req.body.content
                };

                let result = await newsModel.clone().insert(yiapi.utils.fnClearInsertData(insertData));

                await trx.commit();
                return {
                    ...yiapi.codeConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                await trx.rollback();
                return yiapi.codeConfig.INSERT_FAIL;
            }
        }
    });
}
