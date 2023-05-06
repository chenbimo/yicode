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
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        config: {},
        handler: async function (req, res) {
            try {
                let menuData = await fastify.redisGet(appConfig.cacheData.menu);

                return {
                    ...appConfig.httpCode.SELECT_SUCCESS,
                    data: {
                        rows: menuData
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.SELECT_FAIL;
            }
        }
    });
}
