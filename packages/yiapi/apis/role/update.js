import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(sysConfig.schemaField.id, '唯一ID'),
            code: fnSchema(sysConfig.schemaField.code, '角色代号'),
            name: fnSchema(null, '角色名称', 'string', 1, 20),
            describe: fnSchema(sysConfig.schemaField.describe, '角色描述'),
            menu_ids: fnSchema(null, '角色菜单ID组', 'string', 0, 2000)
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let roleModel = fastify.mysql //
                    .table('sys_role')
                    .where({ id: req.body.id })
                    .modify(function (queryBuilder) {});

                // 需要更新的数据
                let data = {
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids,
                    api_ids: req.body.api_ids
                };

                let result = await roleModel.update(fnClearUpdateData(data));

                await fastify.cacheRoleData('file');

                return {
                    ...codeConfig.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
