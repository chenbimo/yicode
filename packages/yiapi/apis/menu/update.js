import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(schemaConfig.id, '唯一ID'),
            pid: fnSchema(schemaConfig.pid, '父级目录ID'),
            name: fnSchema(null, '目录名称', 'string', 1, 30),
            value: fnSchema(null, '目录值', 'string', 0, 300),
            icon: fnSchema(schemaConfig.image, '目录图标'),
            sort: fnSchema(schemaConfig.min1, '目录排序'),
            state: fnSchema(schemaConfig.state, '目录状态'),
            describe: fnSchema(schemaConfig.describe, '目录描述'),
            is_bool: fnSchema(schemaConfig.boolEnum, '是否虚拟目录'),
            is_open: fnSchema(schemaConfig.boolEnum, '是否公开')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.route({
        method: 'POST',
        url: `/${apiInfo.pureFileName}`,
        schema: apiSchema,
        config: {
            isLogin: true
        },
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                let treeModel = trx.table(mapTableConfig.sys_tree);

                let parentData = undefined;

                // 如果传了pid值
                if (req.body.pid) {
                    parentData = await treeModel.clone().where('id', req.body.pid).first();
                    if (parentData === undefined) {
                        return { ...constantConfig.code.FAIL, msg: '父级树不存在' };
                    }
                }

                let selfData = await treeModel.clone().where('id', req.body.id).first();
                if (selfData === undefined) {
                    return { ...constantConfig.code.FAIL, msg: '菜单不存在' };
                }

                // 需要更新的数据
                let data = {
                    pid: req.body.pid,
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

                await trx.commit();
                await fastify.cacheTreeData();
                return constantConfig.code.UPDATE_SUCCESS;
            } catch (err) {
                await trx.rollback();
                fastify.log.error(err);
                return constantConfig.code.UPDATE_FAIL;
            }
        }
    });
}
