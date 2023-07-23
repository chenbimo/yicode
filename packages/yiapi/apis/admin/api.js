// 工具函数
import { fnApiInfo } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
const apiInfo = await fnApiInfo(import.meta.url);
// 传参校验
export const apiSchema = {
    summary: `查询${metaConfig.name}接口权限`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}接口权限`,
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
                const result = await fastify.getUserApis(req.session);
                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        rows: result
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
