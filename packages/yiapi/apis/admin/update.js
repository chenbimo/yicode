// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnSaltMD5 } from '../../utils/fnSaltMD5.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
import { tableData } from '../../tables/admin.js';
// 接口元数据
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: fnSchema(schemaHelperConfig.id),
                password: fnSchema(tableData.password),
                nickname: fnSchema(tableData.nickname),
                role: fnSchema(tableData.role)
            },
            required: ['id']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                if (req.body.role === 'dev') {
                    return {
                        ...httpConfig.FAIL,
                        msg: '不能增加开发管理员角色'
                    };
                }
                const adminModel = fastify.mysql //
                    .table('sys_admin')
                    .where({ id: req.body.id })
                    .modify(function (db) {});

                await adminModel.clone().updateData({
                    password: fnSaltMD5(req.body.password),
                    nickname: req.body.nickname,
                    role: req.body.role
                });

                return httpConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
