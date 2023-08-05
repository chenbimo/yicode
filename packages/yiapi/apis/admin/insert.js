// 工具函数
import { fnTimestamp, fnDbInsertData, fnApiInfo, fnMD5, fnPureMD5 } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 传参校验
export let apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `添加${metaConfig.name}`,
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            username: metaConfig.schema.username,
            password: metaConfig.schema.password,
            nickname: metaConfig.schema.nickname,
            role_codes: metaConfig.schema.role_codes
        },
        required: ['username', 'password', 'nickname', 'role_codes']
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let adminModel = fastify.mysql.table('sys_admin');
                let adminData = await adminModel.clone().where('username', req.body.username).first('id');
                if (adminData?.id) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '管理员账号或昵称已存在'
                    };
                }

                let insertData = {
                    username: req.body.username,
                    password: fnMD5(fnPureMD5(req.body.password)),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes
                };

                let result = await adminModel.clone().insert(fnDbInsertData(insertData));
                return {
                    ...codeConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
}
