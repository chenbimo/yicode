// 工具函数
import { fnRoute, fnField } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '更新用户信息';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                avatar: metaConfig.schema.avatar,
                nickname: metaConfig.schema.nickname,
                bio: metaConfig.schema.bio,
                describe: metaConfig.schema.describe
            },
            required: []
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const userModel = fastify.mysql //
                    .table('sys_user')
                    .where({ id: req.session.id });

                const result = await userModel
                    //
                    .clone()
                    .where({ id: req.session.id })
                    .updateData({
                        avatar: req.body.avatar,
                        nickname: req.body.nickname,
                        bio: req.body.bio,
                        describe: req.body.describe
                    });

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
};
