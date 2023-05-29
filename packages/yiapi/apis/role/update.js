import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(schemaField.id, '唯一ID'),
            code: fnSchema(schemaField.code, '角色代号'),
            name: fnSchema(null, '角色名称', 'string', 1, 20),
            describe: fnSchema(schemaField.describe, '角色描述'),
            menu_ids: {
                title: '菜单ID组',
                type: 'array',
                minItems: 0,
                maxItems: 1000,
                items: {
                    type: 'number'
                }
            },
            api_ids: {
                title: '接口ID组',
                type: 'array',
                minItems: 0,
                maxItems: 1000,
                items: {
                    type: 'number'
                }
            }
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
                    .modify(function (queryBuilder) {});

                // 需要更新的数据
                let data = {
                    code: req.body.code,
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids.join(','),
                    api_ids: req.body.api_ids.join(',')
                };

                let result = await roleModel.clone().where({ id: req.body.id }).update(fnClearUpdateData(data));

                await fastify.cacheRoleData();

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
