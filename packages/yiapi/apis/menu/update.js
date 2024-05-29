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
                id: fnSchema(tableData.code),
                pid: fnSchema(tableData.code),
                name: fnSchema(tableData.code),
                value: fnSchema(tableData.code),
                icon: fnSchema(tableData.code),
                sort: fnSchema(tableData.code),
                describe: fnSchema(tableData.code),
                is_open: fnSchema(tableData.code)
            },
            required: ['id']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const menuModel = fastify.mysql.table('sys_menu');

                // 如果传了 pid 值
                if (req.body.pid) {
                    const parentData = await menuModel.clone().where('id', req.body.pid).selectOne('id');
                    if (!parentData?.id) {
                        return {
                            ...httpConfig.FAIL,
                            msg: '父级菜单不存在'
                        };
                    }
                }

                const selfData = await menuModel.clone().where('id', req.body.id).selectOne('id');
                if (!selfData?.id) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '菜单不存在'
                    };
                }

                const res = await menuModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .updateData({
                        pid: req.body.pid,
                        name: req.body.name,
                        value: req.body.value,
                        icon: req.body.icon,
                        sort: req.body.sort,
                        is_open: req.body.is_open,
                        describe: req.body.describe
                    });

                await fastify.cacheMenuData();
                return httpConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
