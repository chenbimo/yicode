// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '删除管理员接口',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.schema.id
            },
            required: ['id']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictModel = fastify.mysql //
                    .table('sys_dict')
                    .where({ id: req.body.id });

                const dictData = await dictModel.clone().selectOne('id', 'is_system');
                if (!dictData?.id) {
                    return codeConfig.NO_DATA;
                }

                if (dictData?.is_system === 1) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '默认字典，无法删除'
                    };
                }

                const result = await dictModel.clone().deleteData();
                return {
                    ...codeConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.DELETE_FAIL;
            }
        }
    });
};
