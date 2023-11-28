// 工具函数
import { fnRoute, fnField } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '查询用户详情',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                // 查询用户是否存在
                const sysUserModel = fastify.mysql.table('sys_user');

                const result = await sysUserModel
                    .clone() //
                    .where('id', req.session.id)
                    .selectOne(fnField('user.json', 'core', ['password']));

                if (!result?.id) {
                    return {
                        ...codeConfig.SELECT_FAIL,
                        msg: '没有查到用户信息'
                    };
                }

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
};
