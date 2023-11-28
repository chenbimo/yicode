// 工具函数
import { fnRoute, fnField } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '邮箱验证码登录',
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
                    .selectOne(fnField('user', 'core', ['password']));

                // 若用户存在则提示该用户已存在
                if (!userData?.id) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '用户不存在'
                    };
                }

                // 若用户存在则提示该用户已存在
                if (!userData?.email) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '请扫码登录后，在个人中心绑定邮箱后再使用此方式登录'
                    };
                }

                // 查询缓存的验证码
                const cacheVerifyCode = await fastify.redisGet(`loginVerifyCode:${req.body.email}`);

                if (!cacheVerifyCode) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '未发送验证码或验证码已过期，请重新发送'
                    };
                }

                if (String(cacheVerifyCode) !== req.body.verify_code) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '验证码错误'
                    };
                }

                await fastify.redis.del(`loginVerifyCode:${req.body.email}`);

                return {
                    ...codeConfig.SUCCESS,
                    msg: '邮箱登录成功',
                    data: userData,
                    token: await fastify.jwt.sign({
                        id: userData.id,
                        nickname: userData.nickname,
                        role_codes: userData.role_codes
                    })
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
};
