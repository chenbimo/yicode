import { fnTimestamp, fnClearUpdateData, fnApiInfo, fnMD5 } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `更新${metaConfig.name}`,
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: metaConfig.schema.id,
            password: metaConfig.schema.password,
            nickname: metaConfig.schema.nickname,
            role_codes: metaConfig.schema.role_codes
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql //
                    .table('sys_admin')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                // 需要更新的数据
                let data = {
                    password: fnMD5(req.body.password),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes
                };

                let updateResult = await adminModel.update(fnClearUpdateData(data));

                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
