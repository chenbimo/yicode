// 工具函数
import { fnRoute, fnField } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                avatar: metaConfig.avatar,
                nickname: metaConfig.nickname,
                bio: metaConfig.bio,
                describe: metaConfig.describe
            },
            required: []
        },
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
                    ...httpConfig.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
