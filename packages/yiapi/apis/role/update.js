// 工具函数
import { fnDbUpdateData, fnApiInfo } from '../../utils/index.js';
// 配置文件夹
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
const apiInfo = await fnApiInfo(import.meta.url);
// 传参验证
export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
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
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                const roleModel = fastify.mysql.table('sys_role').modify(function (queryBuilder) {});

                const roleData = await roleModel.clone().where('name', req.body.name).orWhere('code', req.body.code).first('id');

                // 编码存在且 id 不等于当前角色
                if (roleData?.id !== req.body.id) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '角色名称或编码已存在'
                    };
                }

                // 需要更新的数据
                const updateData = {
                    code: req.body.code,
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids.join(','),
                    api_ids: req.body.api_ids.join(',')
                };

                const result = await roleModel.clone().where({ id: req.body.id }).update(fnDbUpdateData(updateData));

                await fastify.cacheRoleData();

                return {
                    ...codeConfig.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
