// 工具函数
import { fnRoute, fnField, fnSaltMD5, fnPureMD5 } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '邮箱密码注册';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                email: metaConfig.email,
                password: metaConfig.password,
                verify_code: metaConfig.verify_code
            },
            required: ['email', 'password', 'verify_code']
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

                // 若用户存在则提示该用户已存在
                if (userData?.id) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '用户已存在'
                    };
                }

                // 查询缓存的验证码
                const cacheVerifyCode = await fastify.redisGet(`registerVerifyCode:${req.body.email}`);
                if (!cacheVerifyCode) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '未发送验证码或验证码已过期，请重新发送'
                    };
                }

                if (cacheVerifyCode !== req.body.verify_code) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '验证码错误'
                    };
                }

                // 若用户不存在则创建该用户
                const result = await userModel //
                    .clone()
                    .insertData({
                        password: fnSaltMD5(fnPureMD5(req.body.password)),
                        email: req.body.email,
                        role_codes: 'user'
                    });

                return {
                    ...httpConfig.SUCCESS,
                    msg: '邮箱注册成功',
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
