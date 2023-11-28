// 工具函数
import { fnRoute, fnField } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '验证码绑定邮箱',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                email: metaConfig.schema.email,
                verify_code: metaConfig.schema.verify_code
            },
            required: ['email', 'verify_code']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const userModel = fastify.mysql.table('sys_user');
                const userData = await userModel //
                    .clone()
                    .where({ email: req.body.email })
                    .selectOne('id');
                if (userData?.id) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '该邮箱已绑定，请更换邮箱'
                    };
                }

                // 查询缓存的验证码
                const cacheVerifyCode = await fastify.redisGet(`bindMailVerifyCode:${req.body.email}`);
                if (!cacheVerifyCode) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '未发送验证码或验证码已过期，请重新发送'
                    };
                }

                if (String(cacheVerifyCode) !== String(req.body.verify_code)) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '验证码错误'
                    };
                }

                const result = await userModel //
                    .clone()
                    .where({ id: req.session.id })
                    .updateData({
                        email: req.body.email
                    });

                return {
                    ...codeConfig.SUCCESS,
                    msg: '邮箱绑定成功',
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
};
