// 工具函数
import { fnRoute, fnField, fnSaltMD5, fnPureMD5 } from '../../utils/index.js';
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
                password: metaConfig.password,
                email: metaConfig.email,
                verify_code: metaConfig.verify_code
            },
            required: ['password', 'email', 'verify_code']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const userModel = fastify.mysql.table('sys_user');
                const userData = await userModel //
                    .clone()
                    .where({ id: req.session.id })
                    .selectOne('id', 'email');

                if (!userData?.email) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '请先绑定邮箱'
                    };
                }

                // 查询缓存的验证码
                const cacheVerifyCode = await fastify.redisGet(`setupPasswordVerifyCode:${req.body.email}`);
                if (!cacheVerifyCode) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '未发送验证码或验证码已过期，请重新发送'
                    };
                }

                if (String(cacheVerifyCode) !== String(req.body.verify_code)) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '验证码错误'
                    };
                }

                const result = await userModel //
                    .clone()
                    .where({ id: req.session.id })
                    .updateData({
                        password: fnSaltMD5(fnPureMD5(req.body.password))
                    });

                return {
                    ...httpConfig.SUCCESS,
                    msg: '修改密码成功',
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
