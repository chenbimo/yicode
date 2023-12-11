// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件夹
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '更新角色';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.schema.id,
                code: metaConfig.schema.code,
                name: metaConfig.schema.name,
                describe: metaConfig.schema.describe,
                menu_ids: metaConfig.schema.menu_ids,
                api_ids: metaConfig.schema.api_ids
            },
            required: ['id']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const roleModel = fastify.mysql //
                    .table('sys_role')
                    .modify(function (qb) {});

                const roleData = await roleModel //
                    .clone()
                    .where('name', req.body.name)
                    .orWhere('code', req.body.code)
                    .selectOne('id');

                // 编码存在且 id 不等于当前角色
                if (roleData?.id !== req.body.id) {
                    return {
                        ...httpConfig.INSERT_FAIL,
                        msg: '角色名称或编码已存在'
                    };
                }

                const result = await roleModel
                    .clone()
                    .where({ id: req.body.id })
                    .updateData({
                        code: req.body.code,
                        name: req.body.name,
                        describe: req.body.describe,
                        menu_ids: req.body.menu_ids.join(','),
                        api_ids: req.body.api_ids.join(',')
                    });

                await fastify.cacheRoleData();

                return {
                    ...httpConfig.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
