import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新角色`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '更新角色接口',
        type: 'object',
        properties: {
            id: fnSchema(schemaConfig.id, '唯一ID'),
            code: fnSchema(schemaConfig.code, '角色代号'),
            name: fnSchema(null, '角色名称', 'string', 1, 20),
            describe: fnSchema(schemaConfig.describe, '角色描述'),
            menu_ids: fnSchema(null, '角色菜单ID组', 'string', 0, 2000)
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
                let roleModel = fastify.mysql //
                    .table(mapTableConfig.sys_role)
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
                    ...constantConfig.code.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
