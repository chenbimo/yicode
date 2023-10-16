// 工具函数
import { fnTimestamp, fnDbUpdateData, fnApiInfo } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 传参验证
export let apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: metaConfig.schema.id,
            pid: metaConfig.schema.pid,
            category: metaConfig.schema.category,
            name: metaConfig.schema.name,
            value: metaConfig.schema.value,
            icon: metaConfig.schema.icon,
            sort: metaConfig.schema.sort,
            describe: metaConfig.schema.describe,
            is_bool: metaConfig.schema.is_bool,
            is_open: metaConfig.schema.is_open
        },
        required: ['id']
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            // TODO: 此处需要使用事务
            try {
                let treeModel = fastify.mysql.table('sys_tree');
                let parentData = null;
                // 如果传了pid值
                if (req.body.pid) {
                    parentData = await treeModel.clone().where('id', req.body.pid).first('id', 'pids');
                    if (!parentData?.id) {
                        return {
                            ...codeConfig.FAIL,
                            msg: '父级树不存在'
                        };
                    }
                }

                let selfData = await treeModel.clone().where('id', req.body.id).first('id');
                if (!selfData?.id) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '菜单不存在'
                    };
                }

                let updateData = {
                    pid: req.body.pid,
                    category: req.body.category,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    is_bool: req.body.is_bool,
                    describe: req.body.describe,
                    state: req.body.state,
                    pids: req.body.pids
                };

                if (parentData !== null) {
                    updateData.pids = [parentData.pids, parentData.id].join(',');
                }
                let result = await treeModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .update(fnDbUpdateData(updateData));

                // 如果更新成功，则更新所有子级
                if (result) {
                    let childrenPids = [updateData.pids || selfData.pid, selfData.id];
                    let updateData2 = {
                        pids: childrenPids.join(','),
                        level: childrenPids.length
                    };
                    await treeModel.clone().where({ pid: selfData.id }).update(fnDbUpdateData(updateData2));
                }

                await fastify.cacheTreeData();
                return {
                    ...codeConfig.UPDATE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
