// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                pid: metaConfig.pid,
                name: metaConfig.name,
                value: metaConfig.value,
                icon: metaConfig.icon,
                sort: metaConfig.sort,
                describe: metaConfig.describe,
                is_open: metaConfig.is_open
            },
            required: ['pid', 'name', 'value']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const menuModel = fastify.mysql.table('sys_menu');

                // 如果传了 pid 值，则判断父级是否存在
                if (req.body.pid) {
                    const parentData = await menuModel //
                        .clone()
                        .where('id', req.body.pid)
                        .selectOne('id');

                    if (!parentData?.id) {
                        return {
                            ...httpConfig.FAIL,
                            msg: '父级菜单不存在'
                        };
                    }
                }

                await menuModel.clone().insertData({
                    pid: req.body.pid,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    describe: req.body.describe
                });

                await fastify.cacheMenuData();
                return httpConfig.INSERT_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
