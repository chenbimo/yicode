import { fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `查询管理员菜单权限`,
    description: `${apiInfo.apiPath}`,
    body: {
        title: '查询管理员菜单权限接口',
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
                const userMenus = await fastify.getUserMenus(req.session);
                return {
                    ...constantConfig.code.SELECT_SUCCESS,
                    data: {
                        rows: userMenus
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.SELECT_FAIL;
            }
        }
    });
}
