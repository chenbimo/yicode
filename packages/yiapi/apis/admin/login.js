import { omit as _omit } from 'lodash-es';

import { fnSchema, fnApiInfo, fnClearInsertData, fnPureMD5, fnMD5 } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { cacheData } from '../../config/cacheData.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `${metaConfig.name}登录`,
    body: {
        title: `${metaConfig.name}登录接口`,
        type: 'object',
        properties: {
            account: fnSchema(schemaField.account, '账号'),
            password: fnSchema(schemaField.password, '密码')
        },
        required: ['account', 'password']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql.table('sys_admin');
                let loginLogModel = fastify.mysql.table('sys_login_log');

                // 查询管理员是否存在
                let adminData = await adminModel //
                    .clone()
                    .orWhere({ username: req.body.account })
                    .orWhere({ phone: req.body.account })
                    .first();

                // 判断用户存在
                if (!adminData) {
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

                let loginLogData = {
                    username: adminData.username,
                    nickname: adminData.nickname,
                    role_codes: adminData.role_codes,
                    ip: req.ip || '',
                    ua: req.headers['user-agent'] || ''
                };

                await loginLogModel.clone().insert(fnClearInsertData(loginLogData));

                // 成功返回
                return {
                    ...codeConfig.SUCCESS,
                    msg: '登录成功',
                    data: _omit(adminData, ['password']),
                    token: await fastify.jwt.sign({
                        id: adminData.id,
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
