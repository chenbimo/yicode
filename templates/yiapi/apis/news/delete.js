import * as yiapi from '@yicode/yiapi';

const apiInfo = await yiapi.utils.fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `删除资讯`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        type: 'object',
        title: '删除资讯接口',
        properties: {
            id: yiapi.utils.fnSchema(yiapi.schemaField.id, '资讯ID')
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
                let newsModel = trx.table('news');

                let result = await newsModel.clone().where('id', req.body.id).delete();

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
