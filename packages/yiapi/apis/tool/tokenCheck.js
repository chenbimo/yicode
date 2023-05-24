import { fnApiInfo } from '../../utils/index.js';

import { codeConfig } from '../../config/codeConfig.js';
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
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                try {
                    let jwtData = await req.jwtVerify();
                    return {
                        ...codeConfig.SUCCESS,
                        data: {
                            state: 'yes'
                        }
                    };
                } catch (err) {
                    return {
                        ...codeConfig.SUCCESS,
                        data: {
                            state: 'no'
                        }
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
}
