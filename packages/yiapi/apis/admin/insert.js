// 工具函数
import { fnRoute, fnMD5, fnPureMD5 } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '添加管理员',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                username: metaConfig.schema.username,
                password: metaConfig.schema.password,
                nickname: metaConfig.schema.nickname,
                role_codes: metaConfig.schema.role_codes
            },
            required: ['username', 'password', 'nickname', 'role_codes']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
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

                let result = await adminModel.clone().insertData(insertData);
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
};
