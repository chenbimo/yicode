// 工具函数
import { fnRoute, fnSaltMD5 } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '更新管理员',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.schema.id,
                password: metaConfig.schema.password,
                nickname: metaConfig.schema.nickname,
                role_codes: metaConfig.schema.role_codes
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

                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
};
