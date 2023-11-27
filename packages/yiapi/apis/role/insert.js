// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '添加角色',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                code: metaConfig.schema.code,
                name: metaConfig.schema.name,
                describe: metaConfig.schema.describe,
                menu_ids: metaConfig.schema.menu_ids,
                api_ids: metaConfig.schema.api_ids
            },
            required: ['name', 'code']
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

                if (roleData?.id) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '角色名称或编码已存在'
                    };
                }

                const result = await roleModel.clone().updateData({
                    code: req.body.code,
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids.join(','),
                    api_ids: req.body.api_ids.join(',')
                });

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
};
