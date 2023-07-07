import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            code: fnSchema(schemaField.code, '角色代号'),
            name: fnSchema(null, '角色名称', 'string', 1, 20),
            describe: fnSchema(schemaField.describe, '角色描述'),
            menu_ids: {
                title: '菜单ID组',
                type: 'array',
                minItems: 0,
                maxItems: 10000,
                items: {
                    type: 'number'
                }
            },
            api_ids: {
                title: '接口ID组',
                type: 'array',
                minItems: 0,
                maxItems: 10000,
                items: {
                    type: 'number'
                }
            }
        },
        required: ['name', 'code']
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

                let _result = await roleModel.clone().where('name', req.body.name).orWhere('code', req.body.code).first();
                if (_result) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '角色名称或编码已存在'
                    };
                }

                let data = {
                    code: req.body.code,
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids.join(','),
                    api_ids: req.body.api_ids.join(',')
                };
                let result = await roleModel.clone().insert(fnClearInsertData(data));

                await fastify.cacheRoleData();

                return {
                    ...codeConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
}
