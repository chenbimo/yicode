import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `添加轮播图`,
    description: `${apiInfo.apiPath}`,
    body: {
        title: '添加轮播图接口',
        type: 'object',
        properties: {
            title: fnSchema(schemaConfig.title, '轮播标题'),
            link: fnSchema(null, '轮播跳转地址', 'string', 0, 300, null, ''),
            thumbnail: fnSchema(schemaConfig.image, '轮播封面'),
            is_recommend: fnSchema(schemaConfig.boolEnum, '是否推荐')
        },
        required: ['title', 'thumbnail']
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
                let bannerModel = fastify.mysql //
                    .table(mapTableConfig.sys_banner)
                    .modify(function (queryBuilder) {});

                let data = {
                    title: req.body.title,
                    link: req.body.link,
                    thumbnail: req.body.thumbnail,
                    is_recommend: req.body.is_recommend
                };
                let result = await bannerModel.insert(fnClearInsertData(data));

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
