import { fnTimestamp, fnClearUpdateData, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
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

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let treeModel = fastify.mysql.table('sys_tree');

                let parentData = undefined;

                // 如果传了pid值
                if (req.body.pid) {
                    parentData = await treeModel.clone().where('id', req.body.pid).first();
                    if (parentData === undefined) {
                        return {
                            ...codeConfig.FAIL,
                            msg: '父级树不存在'
                        };
                    }
                }

                let selfData = await treeModel.clone().where('id', req.body.id).first();
                if (selfData === undefined) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '菜单不存在'
                    };
                }

                // 需要更新的数据
                let data = {
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

                if (parentData !== undefined) {
                    data.pids = [parentData.pids, parentData.id].join(',');
                }
                let updateResult = await treeModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .update(fnClearUpdateData(data));

                // 如果更新成功，则更新所有子级
                if (updateResult) {
                    let childrenPids = [data.pids || selfData.pid, selfData.id];
                    await treeModel
                        .clone()
                        .where({ pid: selfData.id })
                        .update({
                            pids: childrenPids.join(','),
                            level: childrenPids.length,
                            updated_at: fnTimestamp()
                        });
                }

                await fastify.cacheTreeData();
                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
