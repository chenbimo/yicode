// 工具函数
import { fnApiInfo } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 传参验证
export let apiSchema = {
    summary: `令牌检测`,
    tags: [apiInfo.parentDirName],
    body: {
        type: 'object',
        title: `令牌检测接口`,
        properties: {}
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                try {
                    let jwtData = await req.jwtVerify();
                    return {
                        ...codeConfig.SUCCESS,
                        data: {
                            state: 'yes'
                        }
                    };
                } catch (err) {
                    return {
                        ...codeConfig.SUCCESS,
                        data: {
                            state: 'no'
                        }
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
}
