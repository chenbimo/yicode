import { fnApiInfo, fnSchema } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询所有${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询所有${metaConfig.name}接口`,
        type: 'object',
        properties: {},
        required: []
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let apiData = await fastify.redisGet(appConfig.cacheData.api);

                return {
                    ...appConfig.httpCode.SELECT_SUCCESS,
                    data: {
                        rows: apiData
                    },
                    from: 'cache'
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.SELECT_FAIL;
            }
        }
    });
}
