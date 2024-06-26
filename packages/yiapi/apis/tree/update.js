// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
import { tableData } from '../../tables/tree.js';
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
                pid: fnSchema(tableData.pid),
                category: fnSchema(tableData.category),
                name: fnSchema(tableData.name),
                value: fnSchema(tableData.value),
                image: fnSchema(tableData.image),
                sort: fnSchema(tableData.sort),
                describe: fnSchema(tableData.describe),
                is_bool: fnSchema(tableData.is_bool),
                is_open: fnSchema(tableData.is_open)
            },
            required: ['id']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            // TODO: 此处需要使用事务
            try {
                const treeModel = fastify.mysql.table('sys_tree');
                let parentData = null;
                // 如果传了 pid 值
                if (req.body.pid) {
                    parentData = await treeModel //
                        .clone()
                        .where('id', req.body.pid)
                        .selectOne(['id', 'pids']);
                    if (!parentData?.id) {
                        return {
                            ...httpConfig.FAIL,
                            msg: '父级树不存在'
                        };
                    }
                }

                const selfData = await treeModel //
                    .clone()
                    .where('id', req.body.id)
                    .selectOne(['id']);
                if (!selfData?.id) {
                    return {
                        ...httpConfig.FAIL,
                        msg: '菜单不存在'
                    };
                }

                const updateData = {
                    pid: req.body.pid,
                    category: req.body.category,
                    name: req.body.name,
                    value: req.body.value,
                    image: req.body.image,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    is_bool: req.body.is_bool,
                    describe: req.body.describe,
                    pids: req.body.pids
                };

                if (parentData !== null) {
                    updateData.pids = [parentData.pids, parentData.id].join(',');
                }
                const result = await treeModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .updateData(updateData);

                // 如果更新成功，则更新所有子级
                if (result) {
                    const childrenPids = [updateData.pids || selfData.pid, selfData.id];
                    await treeModel
                        .clone()
                        .where({ pid: selfData.id })
                        .updateData({
                            pids: childrenPids.join(','),
                            level: childrenPids.length
                        });
                }

                return {
                    ...httpConfig.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
