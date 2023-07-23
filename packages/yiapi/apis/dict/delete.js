// 工具函数
import { fnApiInfo } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
const apiInfo = await fnApiInfo(import.meta.url);
// 传参校验
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
                const dictModel = fastify.mysql //
                    .table('sys_dict')
                    .where({ id: req.body.id });

                const dictData = await dictModel.clone().first('id', 'is_system');
                if (!dictData?.id) {
                    return codeConfig.NO_DATA;
                }

                if (dictData?.is_system === 1) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '默认字典，无法删除'
                    };
                }

                const result = await dictModel.clone().delete();
                return {
                    ...codeConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.DELETE_FAIL;
            }
        }
    });
}
