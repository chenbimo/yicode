// 外部模块
import { omit as _omit } from 'lodash-es';
// 工具函数
import { fnApiInfo, fnDbInsertData, fnPureMD5, fnMD5 } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { cacheData } from '../../config/cacheData.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 传参校验
export let apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `${metaConfig.name}登录`,
    body: {
        title: `${metaConfig.name}登录接口`,
        type: 'object',
        properties: {
            account: metaConfig.schema.account,
            password: metaConfig.schema.password
        },
        required: ['account', 'password']
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql.table('sys_admin');
                let loginLogModel = fastify.mysql.table('sys_login_log');

                // 查询管理员是否存在
                // TODO: 增加邮箱注册和邮箱登录
                let adminData = await adminModel //
                    .clone()
                    .orWhere({ username: req.body.account })
                    .first('id', 'password', 'username', 'nickname', 'role_codes');

                // 判断用户存在
                if (!adminData?.id) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '用户不存在'
                    };
                }

                // 判断密码
                if (fnMD5(req.body.password) !== adminData.password) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '密码错误'
                    };
                }
                // 登录日志数据
                let loginLogData = {
                    username: adminData.username,
                    nickname: adminData.nickname,
                    role_codes: adminData.role_codes,
                    ip: req.ip || '',
                    ua: req.headers['user-agent'] || ''
                };

                await loginLogModel.clone().insert(fnDbInsertData(loginLogData));

                // 成功返回
                return {
                    ...codeConfig.SUCCESS,
                    msg: '登录成功',
                    data: _omit(adminData, ['password']),
                    token: await fastify.jwt.sign({
                        id: adminData.id,
                        username: adminData.username,
                        nickname: adminData.nickname,
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
}
