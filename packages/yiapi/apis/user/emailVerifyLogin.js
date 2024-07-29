// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { getDbFields } from '../../utils/getDbFields.js';
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
                email: fnSchema(tableData.email),
                verify_code: fnSchema({ name: '验证码', schema: { type: 'string', min: 6, max: 6 } })
            },
            required: ['email', 'verify_code']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const userModel = fastify.mysql.table('sys_user');

                const userData = await userModel //
                    .clone()
                    .where({ email: req.body.email })
                    .selectOne(getDbFields(tableData, ['password']));

                // 若用户存在则提示该用户已存在
                if (!userData?.id) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '用户不存在'
                    };
                }

                // 若用户存在则提示该用户已存在
                if (!userData?.email) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '请扫码登录后，在个人中心绑定邮箱后再使用此方式登录'
                    };
                }

                // 查询缓存的验证码
                const cacheVerifyCode = await fastify.redisGet(`loginVerifyCode:${req.body.email}`);

                if (!cacheVerifyCode) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '未发送验证码或验证码已过期，请重新发送'
                    };
                }

                if (String(cacheVerifyCode) !== req.body.verify_code) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '验证码错误'
                    };
                }

                await fastify.redis.del(`loginVerifyCode:${req.body.email}`);

                return {
                    ...httpConfig.SUCCESS,
                    msg: '邮箱登录成功',
                    token: await fastify.jwt.sign({
                        id: userData.id,
                        nickname: userData.nickname,
                        role_type: 'user',
                        role: userData.role
                    })
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
