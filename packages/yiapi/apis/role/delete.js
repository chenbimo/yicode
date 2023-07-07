import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除${metaConfig.name}`,
    body: {
        title: `删除${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(schemaField.id, '唯一ID')
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
                    .where('id', req.body.id)
                    .modify(function (queryBuilder) {});

                let roleData = await roleModel.clone().first();
                if (!roleData) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '角色不存在'
                    };
                }

                if (roleData.is_system === 1) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '默认角色，无法删除'
                    };
                }

                let result = await roleModel.clone().delete();

                // 生成新的权限
                await fastify.cacheRoleData();

                return {
                    ...codeConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                return codeConfig.DELETE_FAIL;
            }
        }
    });
}
