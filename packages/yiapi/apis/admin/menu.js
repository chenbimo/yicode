// 工具函数
import { fnApiInfo } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 传参校验
export let apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `查询${metaConfig.name}菜单权限`,
    body: {
        title: `查询${metaConfig.name}菜单权限接口`,
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
                let userMenus = await fastify.getUserMenus(req.session);
                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        rows: userMenus
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
