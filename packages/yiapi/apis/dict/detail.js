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
    summary: `查询${metaConfig.name}详情`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}详情接口`,
        type: 'object',
        properties: {
            code: metaConfig.schema.code
        },
        required: ['code']
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let dictModel = fastify.mysql.table('sys_dict');

                let result = await dictModel //
                    .clone()
                    .where('code', req.body.code)
                    .first();

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
