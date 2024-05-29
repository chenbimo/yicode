// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnSaltMD5 } from '../../utils/fnSaltMD5.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
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
                email: metaConfig.email,
                password: metaConfig.password
            },
            required: ['email', 'password']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const userModel = fastify.mysql.table('sys_user');
                const userData = await userModel //
                    .clone()
                    .where({ email: req.body.email })
                    .selectOne(Object.keys(tableData));

                if (!userData?.id) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '用户不存在'
                    };
                }

                // 如果没有设置密码，则提示设置密码后登录
                if (!userData?.password) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '请扫码登录后，在个人中心绑定邮箱并设置密码后再使用此方式登录'
                    };
                }

                if (userData.password !== fnSaltMD5(req.body.password)) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '密码错误'
                    };
                }

                return {
                    ...httpConfig.SUCCESS,
                    msg: '密码登录成功',
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
