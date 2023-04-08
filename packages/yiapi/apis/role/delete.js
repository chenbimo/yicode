import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除角色`,
    description: `${apiInfo.apiPath}`,
    body: {
        title: '删除角色接口',
        type: 'object',
        properties: {
            id: fnSchema(schemaConfig.id, '唯一ID')
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
                    .where('id', req.body.id)
                    .modify(function (queryBuilder) {});

                let roleData = await roleModel.clone().first();
                if (!roleData) {
                    return {
                        ...constantConfig.code.DELETE_FAIL,
                        msg: '角色不存在'
                    };
                }

                if (roleData.is_system === 1) {
                    return {
                        ...constantConfig.code.DELETE_FAIL,
                        msg: '默认角色，无法删除'
                    };
                }

                let result = await roleModel.clone().delete();

                // 生成新的权限
                await fastify.cacheRoleData('file');

                return {
                    ...constantConfig.code.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                return constantConfig.code.DELETE_FAIL;
            }
        }
    });
}
