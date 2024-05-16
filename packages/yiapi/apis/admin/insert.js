// 工具函数
import { fnRoute, fnSaltMD5, fnPureMD5, fnProp } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';
import { tableData } from '../../tables/admin.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                username: fnProp(tableData.username),
                password: fnProp(tableData.password),
                nickname: fnProp(tableData.nickname),
                role_codes: fnProp(tableData.role_codes)
            },
            required: ['username', 'password', 'nickname', 'role_codes']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                if (req.body.role_codes === 'dev') {
                    return {
                        ...httpConfig.FAIL,
                        msg: '不能增加开发管理员角色'
                    };
                }
                const adminModel = fastify.mysql.table('sys_admin');
                const adminData = await adminModel.clone().where('username', req.body.username).selectOne('id');
                if (adminData?.id) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '管理员账号或昵称已存在'
                    };
                }

                const result = await adminModel.clone().insertData({
                    username: req.body.username,
                    password: fnSaltMD5(fnPureMD5(req.body.password)),
                    nickname: req.body.nickname,
                    role_codes: req.body.role_codes
                });
                return {
                    ...httpConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
