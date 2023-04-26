import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: schemaConfig.id,
            link: fnSchema(null, '轮播跳转地址', 'string', 0, 300, null, ''),
            thumbnail: fnSchema(schemaConfig.image, '轮播封面'),
            is_recommend: fnSchema(schemaConfig.boolEnum, '是否推荐')
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
                let bannerModel = fastify.mysql //
                    .table(mapTableConfig.sys_banner)
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                // 需要更新的数据
                let data = {
                    title: req.body.title,
                    link: req.body.link,
                    thumbnail: req.body.thumbnail,
                    is_recommend: req.body.is_recommend
                };

                let result = await bannerModel.update(fnClearUpdateData(data));
                return constantConfig.code.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
