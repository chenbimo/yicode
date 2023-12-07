// 外部模块
import { omit as _omit } from 'lodash-es';
// 工具函数
import { fnRoute, fnPureMD5, fnSaltMD5 } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '管理员登录';

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
                account: metaConfig.schema.account,
                password: metaConfig.schema.password
            },
            required: ['account', 'password']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const adminModel = fastify.mysql.table('sys_admin');
                const loginLogModel = fastify.mysql.table('sys_login_log');

                // 查询管理员是否存在
                // TODO: 增加邮箱注册和邮箱登录
                const adminData = await adminModel //
                    .clone()
                    .orWhere({ username: req.body.account })
                    .selectOne('id', 'password', 'username', 'nickname', 'role_codes');

                // 判断用户存在
                if (!adminData?.id) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '用户不存在'
                    };
                }

                // 判断密码
                if (fnSaltMD5(req.body.password) !== adminData.password) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '密码错误'
                    };
                }
                // 记录登录日志
                await loginLogModel.clone().insertData({
                    username: adminData.username,
                    nickname: adminData.nickname,
                    role_codes: adminData.role_codes,
                    ip: req.ip || '',
                    ua: req.headers['user-agent'] || ''
                });

                // 成功返回
                return {
                    ...codeConfig.SUCCESS,
                    msg: '登录成功',
                    data: _omit(adminData, ['password']),
                    token: await fastify.jwt.sign({
                        id: adminData.id,
                        username: adminData.username,
                        nickname: adminData.nickname,
                        role_type: 'admin',
                        role_codes: adminData.role_codes
                    })
                };
            } catch (err) {
                fastify.log.error(err);
                return {
                    ...codeConfig.FAIL,
                    msg: '登录失败'
                };
            }
        }
    });
};
