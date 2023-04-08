import { fnApiInfo, fnSchema } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询所有角色`,
    tags: [apiInfo.parentDirName],
    description: `${apiInfo.apiPath}`,
    body: {
        title: '查询所有角色接口',
        type: 'object',
        properties: {}
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
                    .modify(function (queryBuilder) {
                        // 如果不是开发管理员查询，则排除掉开发角色
                        if (req.session.role_codes !== 'dev') {
                            queryBuilder.where('code', '<>', 'dev');
                        }
                    });

                let rows = await roleModel.clone().select();

                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
