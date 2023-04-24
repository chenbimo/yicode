import { omit as _omit } from 'lodash-es';

import { fnSchema, fnApiInfo, fnPureMD5, fnMD5 } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { cacheConfig } from '../../config/cache.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `管理员登录`,
    description: `${apiInfo.apiPath}`,
    body: {
        title: '管理员登录接口',
        type: 'object',
        properties: {
            account: fnSchema(schemaConfig.account, '账号'),
            password: fnSchema(schemaConfig.password, '密码')
        },
        required: ['account', 'password']
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {
            isLogin: false
        },
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql
                    .table(mapTableConfig.sys_admin)
                    //
                    .orWhere({ username: req.body.account })
                    .orWhere({ phone: req.body.account });

                // 查询用户是否存在
                let adminData = await adminModel.clone().first();
                // 判断用户存在
                if (!adminData) {
                    return {
                        ...constantConfig.code.FAIL,
                        msg: '用户不存在'
                    };
                }

                // 判断密码
                if (fnMD5(req.body.password) !== adminData.password) {
                    return {
                        ...constantConfig.code.FAIL,
                        msg: '密码错误'
                    };
                }

                let dataRoleCodes = await fastify.redisGet(cacheConfig.cacheData_role, 'json');
                let roleCodesArray = adminData.role_codes.split(',');
                let role_codes = [];
                dataRoleCodes.forEach((item) => {
                    if (roleCodesArray.includes(item.id)) {
                        role_codes.push(item.code);
                    }
                });

                // 成功返回
                return {
                    ...constantConfig.code.SUCCESS,
                    msg: '登录成功',
                    data: _omit(adminData, ['password']),
                    token: await fastify.jwt.sign({
                        id: adminData.id,
                        uuid: adminData.uuid,
                        role_codes: adminData.role_codes
                    })
                };
            } catch (err) {
                fastify.log.error(err);
                return {
                    ...constantConfig.code.FAIL,
                    msg: '登录失败'
                };
            }
        }
    });
}
