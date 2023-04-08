import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加意见反馈`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '添加意见反馈接口',
        type: 'object',
        properties: {
            question: fnSchema(schemaConfig.string0to2000, '反馈内容')
        },
        required: ['question']
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let feedbackModel = fastify.mysql //
                    .table(mapTableConfig.sys_feedback)
                    .modify(function (queryBuilder) {});

                let data = {
                    ask_id: req.session.id,
                    question: req.body.question
                };

                let result = await feedbackModel.insert(fnClearInsertData(data));
                return {
                    ...constantConfig.code.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.INSERT_FAIL;
            }
        }
    });
}
