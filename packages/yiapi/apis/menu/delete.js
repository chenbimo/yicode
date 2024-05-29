// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
import { tableData } from '../../tables/menu.js';
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
                id: fnSchema(schemaHelperConfig.id)
            },
            required: ['id']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const menuModel = fastify.mysql.table('sys_menu');

                const menuData = await menuModel.clone().selectOne('id');

                if (!menuData?.id) {
                    return {
                        ...httpConfig.DELETE_FAIL,
                        msg: '菜单不存在'
                    };
                }

                if (menuData.is_system === 1) {
                    return {
                        ...httpConfig.DELETE_FAIL,
                        msg: '默认菜单，无法删除'
                    };
                }

                const childData = await menuModel.clone().where({ pid: req.body.id }).selectOne('id');

                if (childData?.id) {
                    return {
                        ...httpConfig.DELETE_FAIL,
                        msg: '存在子菜单，无法删除'
                    };
                }

                const result = await menuModel.clone().where({ id: req.body.id }).deleteData();
                await fastify.cacheMenuData();
                return {
                    ...httpConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.DELETE_FAIL;
            }
        }
    });
};
