import { fnSchema, fnApiInfo, fnPageOffset } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `令牌检测`,
    tags: [apiInfo.parentDirName],
    body: {
        type: 'object',
        title: `令牌检测接口`,
        properties: {}
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {},
        handler: async function (req, res) {
            try {
                try {
                    let jwtData = await req.jwtVerify();
                    return {
                        ...appConfig.httpCode.SUCCESS,
                        data: {
                            state: 'yes'
                        }
                    };
                } catch (err) {
                    return {
                        ...appConfig.httpCode.SUCCESS,
                        data: {
                            state: 'no'
                        }
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.FAIL;
            }
        }
    });
}
