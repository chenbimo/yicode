import * as yiapi from '@yicode/yiapi';

const apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询资讯详情`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        type: 'object',
        title: '查询资讯详情接口',
        properties: {
            id: yiapi.utils.fnSchema(yiapi.schemaField.id, '唯一 ID')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        config: {},
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                let newsModel = trx.table('news');

                let result = await newsModel //
                    .clone()
                    .where({ id: req.body.id })
                    .first();
                await trx.commit();

                return {
                    ...yiapi.codeConfig.SELECT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                await trx.rollback();
                return yiapi.codeConfig.SELECT_FAIL;
            }
        }
    });
}
