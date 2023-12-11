// 工具函数
import { fnRoute, fnCamelCase } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '更新字典目录';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.id,
                code: metaConfig.code,
                name: metaConfig.name,
                describe: metaConfig.describe,
                state: metaConfig.state
            },
            required: ['id', 'code']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const dictCategoryModel = fastify.mysql.table('sys_dict_category').modify(function (qb) {});

                const dictCategoryData = await dictCategoryModel
                    .clone()
                    .where({ code: fnCamelCase(req.body.code) })
                    .selectOne('id');

                if (dictCategory?.id) {
                    return {
                        ...httpConfig.INSERT_FAIL,
                        msg: '当前编号已存在'
                    };
                }

                const result = await dictCategoryModel //
                    .clone()
                    .where({ id: req.body.id })
                    .updateData({
                        code: fnCamelCase(req.body.code),
                        name: req.body.name,
                        describe: req.body.describe,
                        state: req.body.state
                    });

                return httpConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
