// 工具函数
import { fnRoute } from '../../utils/index.js';
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
                category: metaConfig.category,
                name: metaConfig.name,
                value: metaConfig.value,
                icon: metaConfig.icon,
                sort: metaConfig.sort,
                describe: metaConfig.describe,
                is_bool: metaConfig.is_bool,
                is_open: metaConfig.is_open
            },
            required: ['pid', 'category', 'name']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const treeModel = fastify.mysql.table('sys_tree').modify(function (db) {});

                if (req.body.pid === 0) {
                    req.body.pids = '0';
                    req.body.level = 1;
                } else {
                    const parentData = await treeModel //
                        .clone()
                        .where('id', req.body.pid)
                        .selectOne('id', 'pids');
                    if (!parentData?.id) {
                        return {
                            ...httpConfig.FAIL,
                            msg: '父级树不存在'
                        };
                    }
                    req.body.pids = `${parentData.pids},${parentData.id}`;
                    req.body.level = req.body.pids.split(',').length;
                }

                const result = await treeModel
                    //
                    .clone()
                    .insertData({
                        pid: req.body.pid,
                        category: req.body.category,
                        name: req.body.name,
                        value: req.body.value,
                        icon: req.body.icon,
                        sort: req.body.sort,
                        is_open: req.body.is_open,
                        is_bool: req.body.is_bool,
                        describe: req.body.describe,
                        pids: req.body.pids,
                        level: req.body.level
                    });

                return {
                    ...httpConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.INSERT_FAIL;
            }
        }
    });
};
