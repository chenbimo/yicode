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
        apiName: '删除菜单',
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
                const menuModel = fastify.mysql.table('sys_menu');

                const menuData = await menuModel.clone().selectOne('id');

                if (!menuData?.id) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '菜单不存在'
                    };
                }

                if (menuData.is_system === 1) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '默认菜单，无法删除'
                    };
                }

                const childData = await menuModel.clone().where({ pid: req.body.id }).selectOne('id');

                if (childData?.id) {
                    return {
                        ...codeConfig.DELETE_FAIL,
                        msg: '存在子菜单，无法删除'
                    };
                }

                const result = await menuModel.clone().where({ id: req.body.id }).deleteData();
                await fastify.cacheTreeData();
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
