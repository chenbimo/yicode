import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除${metaConfig.name}`,
    body: {
        title: `删除${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(sysConfig.schemaField.id, '唯一ID')
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
                    .table(appConfig.table.sys_role)
                    .where('id', req.body.id)
                    .modify(function (queryBuilder) {});

                let roleData = await roleModel.clone().first();
                if (!roleData) {
                    return {
                        ...appConfig.httpCode.DELETE_FAIL,
                        msg: '角色不存在'
                    };
                }

                if (roleData.is_system === 1) {
                    return {
                        ...appConfig.httpCode.DELETE_FAIL,
                        msg: '默认角色，无法删除'
                    };
                }

                let result = await roleModel.clone().delete();

                // 生成新的权限
                await fastify.cacheRoleData('file');

                return {
                    ...appConfig.httpCode.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                return appConfig.httpCode.DELETE_FAIL;
            }
        }
    });
}
