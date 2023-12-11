// 工具函数
import { fnRoute, fnSaltMD5 } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '更新管理员';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.id,
                password: metaConfig.password,
                nickname: metaConfig.nickname,
                role_codes: metaConfig.role_codes
            },
            required: ['id']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const adminModel = fastify.mysql //
                    .table('sys_admin')
                    .where({ id: req.body.id })
                    .modify(function (qb) {});

                await adminModel.clone().updateData({
                    password: fnSaltMD5(req.body.password),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes
                });

                return httpConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
