// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { toOmit } from '../../utils/toOmit.js';
import { getDbFields } from '../../utils/getDbFields.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
import { tableData } from '../../tables/user.js';
// 接口元数据
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                // 查询用户是否存在
                const sysUserModel = fastify.mysql.table('sys_user');

                const result = await sysUserModel
                    .clone() //
                    .where('id', req.session.id)
                    .selectOne(getDbFields(tableData, ['password']));

                if (!result?.id) {
                    return {
                        ...httpConfig.SELECT_FAIL,
                        msg: '没有查到用户信息'
                    };
                }

                return {
                    ...httpConfig.SELECT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.SELECT_FAIL;
            }
        }
    });
};
