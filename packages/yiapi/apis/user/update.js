// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
import { tableData } from '../../tables/user.js';
// 接口元数据
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                avatar: fnSchema(tableData.code),
                nickname: fnSchema(tableData.code),
                bio: fnSchema(tableData.code),
                describe: fnSchema(tableData.code)
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
