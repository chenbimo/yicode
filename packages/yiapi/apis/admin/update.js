import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo, fnMD5 } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `更新${metaConfig.name}`,
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(schemaConfig.id, '唯一ID'),
            password: fnSchema(schemaConfig.password, '密码'),
            nickname: fnSchema(schemaConfig.nickname, '昵称'),
            role_codes: fnSchema(schemaConfig.role_codes, '角色代码')
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
                let adminModel = fastify.mysql //
                    .table(mapTableConfig.sys_admin)
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                // 需要更新的数据
                let data = {
                    password: fnMD5(req.body.password),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes
                };

                let updateResult = await adminModel.update(fnClearUpdateData(data));

                return constantConfig.code.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
