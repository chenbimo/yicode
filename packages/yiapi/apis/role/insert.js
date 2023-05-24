import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            code: fnSchema(sysConfig.schemaField.code, '角色代号'),
            name: fnSchema(null, '角色名称', 'string', 1, 20),
            describe: fnSchema(sysConfig.schemaField.describe, '角色描述'),
            menu_ids: fnSchema(null, '角色菜单ID组', 'string', 0, 2000)
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
                let _result = await roleModel.clone().where('name', req.body.name).first();
                if (_result !== undefined) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '角色已存在'
                    };
                }

                let data = {
                    code: req.body.code,
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids
                };
                let result = await roleModel.clone().insert(fnClearInsertData(data));

                await fastify.cacheRoleData('file');

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
