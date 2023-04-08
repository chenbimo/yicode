import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新通知`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '更新通知接口',
        type: 'object',
        properties: {
            id: fnSchema(schemaConfig.id, '唯一ID'),
            title: fnSchema(schemaConfig.title, '通知标题'),
            describe: fnSchema(schemaConfig.describe, '通知摘要'),
            thumbnail: fnSchema(schemaConfig.image, '通知封面图'),
            is_recommend: fnSchema(schemaConfig.boolEnum, '是否推荐'),
            content: fnSchema(schemaConfig.content, '字典正文')
        },
        required: ['id']
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
                let noticeModel = fastify.mysql //
                    .table(mapTableConfig.sys_notice)
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                let data = {
                    title: req.body.title,
                    describe: req.body.describe,
                    thumbnail: req.body.thumbnail,
                    content: req.body.content,
                    is_recommend: req.body.is_recommend
                };

                let result = await noticeModel.update(fnClearUpdateData(data));

                return {
                    ...constantConfig.code.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
