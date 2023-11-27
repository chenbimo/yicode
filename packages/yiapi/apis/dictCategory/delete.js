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
        apiName: '删除字典目录',
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
                const dictCategoryModel = fastify.mysql //
                    .table('sys_dict_category')
                    .where({ id: req.body.id });

                const dictModel = fastify.mysql.table('sys_dict');

                const dictCategoryData = await dictCategoryModel.clone().selectOne('id');

                if (!dictCategoryData?.id) {
                    return codeConfig.NO_DATA;
                }

                const childrenDict = await dictModel.clone().where({ category_id: req.body.id }).selectOne('id');
                if (childrenDict?.id) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '此分类下有字典，无法删除'
                    };
                }

                const result = await dictCategoryModel.clone().deleteData();
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
