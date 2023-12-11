// 工具函数
import { fnRoute } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '更新菜单';

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
                id: metaConfig.schema.id,
                pid: metaConfig.schema.pid,
                name: metaConfig.schema.name,
                value: metaConfig.schema.value,
                icon: metaConfig.schema.icon,
                sort: metaConfig.schema.sort,
                state: metaConfig.schema.state,
                describe: metaConfig.schema.describe,
                is_open: metaConfig.schema.is_open
            },
            required: ['id']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const menuModel = fastify.mysql.table('sys_menu');

                // 如果传了 pid 值
                if (req.body.pid) {
                    let parentData = await menuModel.clone().where('id', req.body.pid).selectOne('id');
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
                        describe: req.body.describe,
                        state: req.body.state
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
