import * as yiapi from '@yicode/yiapi';

const apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新资讯`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        type: 'object',
        title: '更新资讯接口',
        properties: {
            category_id: yiapi.utils.fnSchema(yiapi.schemaField.id, '资讯标题'),
            id: yiapi.utils.fnSchema(yiapi.schemaField.id, '资讯 ID'),
            title: yiapi.utils.fnSchema(yiapi.schemaField.title, '资讯标题'),
            describe: yiapi.utils.fnSchema(yiapi.schemaField.string0to500, '资讯描述'),
            thumbnail: yiapi.utils.fnSchema(yiapi.schemaField.image, '资讯缩略图'),
            content: yiapi.utils.fnSchema(yiapi.schemaField.content, '资讯正文')
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
        config: {},
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

                let result = await newsModel.clone().update(yiapi.utils.fnClearUpdateData(updateData));

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
