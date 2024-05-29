// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
// 配置文件夹
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
import { tableData } from '../../tables/role.js';
// 接口元数据
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: fnSchema(schemaHelperConfig.id),
                code: fnSchema(tableData.code),
                name: fnSchema(tableData.name),
                describe: fnSchema(tableData.describe),
                menu_ids: fnSchema(tableData.menu_ids),
                api_ids: fnSchema(tableData.api_ids)
            },
            required: ['id']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const roleModel = fastify.mysql //
                    .table('sys_role')
                    .modify(function (db) {});

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
