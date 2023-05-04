import { omit as _omit } from 'lodash-es';

import { fnSchema, fnApiInfo, fnPureMD5, fnMD5 } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `${metaConfig.name}登录`,
    body: {
        title: `${metaConfig.name}登录接口`,
        type: 'object',
        properties: {
            account: fnSchema(sysConfig.schemaField.account, '账号'),
            password: fnSchema(sysConfig.schemaField.password, '密码')
        },
        required: ['account', 'password']
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {},
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql
                    .table(appConfig.table.sys_admin)
                    //
                    .orWhere({ username: req.body.account })
                    .orWhere({ phone: req.body.account });

                // 查询用户是否存在
                let adminData = await adminModel.clone().first();
                // 判断用户存在
                if (!adminData) {
                    return {
                        ...appConfig.httpCode.FAIL,
                        msg: '用户不存在'
                    };
                }

                // 判断密码
                if (fnMD5(req.body.password) !== adminData.password) {
                    return {
                        ...appConfig.httpCode.FAIL,
                        msg: '密码错误'
                    };
                }

                let dataRoleCodes = await fastify.redisGet(appConfig.cacheData.role);
                let roleCodesArray = adminData.role_codes.split(',');
                let role_codes = [];
                dataRoleCodes.forEach((item) => {
                    if (roleCodesArray.includes(item.id)) {
                        role_codes.push(item.code);
                    }
                });

                // 成功返回
                return {
                    ...appConfig.httpCode.SUCCESS,
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
                    ...appConfig.httpCode.FAIL,
                    msg: '登录失败'
                };
            }
        }
    });
}
