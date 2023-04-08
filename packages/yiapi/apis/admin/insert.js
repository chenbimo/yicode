import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo, fnMD5, fnPureMD5, fnUUID } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `添加管理员`,
    description: `${apiInfo.apiPath}`,
    body: {
        title: '添加管理员接口',
        type: 'object',
        properties: {
            username: fnSchema(schemaConfig.username, '用户名'),
            password: fnSchema(schemaConfig.password, '密码'),
            nickname: fnSchema(schemaConfig.nickname, '昵称'),
            role_codes: fnSchema(schemaConfig.role_codes, '角色代码')
        },
        required: ['username', 'password', 'nickname', 'role_codes']
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql.table(mapTableConfig.sys_admin);
                let adminExistsData = await adminModel.clone().where('username', req.body.username).first();
                if (adminExistsData) {
                    return {
                        ...constantConfig.code.FAIL,
                        msg: '管理员账号或昵称已存在'
                    };
                }

                let insertData = {
                    username: req.body.username,
                    password: fnMD5(fnPureMD5(req.body.password)),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes
                };

                let result = await adminModel.clone().insert(fnClearInsertData(insertData));
                return {
                    ...constantConfig.code.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.INSERT_FAIL;
            }
        }
    });
}
