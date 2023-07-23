// 工具函数
import { fnApiInfo } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
const apiInfo = await fnApiInfo(import.meta.url);
// 选择字段
const selectKeys = fnSelectFields('./tables/role.json');
// 传参验证
export const apiSchema = {
    summary: `查询所有${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询所有${metaConfig.name}接口`,
        type: 'object',
        properties: {}
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
                    .modify(function (queryBuilder) {
                        // 如果不是开发管理员查询，则排除掉开发角色
                        if (req.session.role_codes !== 'dev') {
                            queryBuilder.where('code', '<>', 'dev');
                        }
                    });

                const rows = await roleModel.clone().select(selectKeys);

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        rows: rows
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
