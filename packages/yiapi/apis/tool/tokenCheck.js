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
        apiName: '令牌检测',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {},
            required: []
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                try {
                    const jwtData = await req.jwtVerify();
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
};
