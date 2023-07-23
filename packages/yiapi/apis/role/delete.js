// 工具函数
import { fnApiInfo } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
const apiInfo = await fnApiInfo(import.meta.url);
// 传参验证
export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除${metaConfig.name}`,
    body: {
        title: `删除${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: metaConfig.schema.id
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
                const roleModel = fastify.mysql //
                    .table('sys_role')
                    .where('id', req.body.id)
                    .modify(function (queryBuilder) {});

                const roleData = await roleModel.clone().first('id', 'is_system');
                if (!roleData?.id) {
                    return codeConfig.NO_DATA;
                }

                if (roleData.is_system === 1) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '默认角色，无法删除'
                    };
                }

                const result = await roleModel.clone().delete();

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
