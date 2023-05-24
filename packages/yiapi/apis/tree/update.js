import { fnSchema, fnTimestamp, fnClearUpdateData, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `更新${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `更新${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(sysConfig.schemaField.id, '唯一ID'),
            pid: fnSchema(sysConfig.schemaField.pid, '父级目录ID'),
            category: fnSchema(sysConfig.schemaField.category, '目录分类'),
            name: fnSchema(null, '目录名称', 'string', 1, 30),
            value: fnSchema(null, '目录值', 'string', 0, 300),
            icon: fnSchema(sysConfig.schemaField.image, '目录图标'),
            sort: fnSchema(sysConfig.schemaField.min0, '目录排序'),
            state: fnSchema(sysConfig.schemaField.state, '目录状态'),
            describe: fnSchema(sysConfig.schemaField.describe, '目录描述'),
            is_bool: fnSchema(sysConfig.schemaField.boolEnum, '是否虚拟目录'),
            is_open: fnSchema(sysConfig.schemaField.boolEnum, '是否公开')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            const trx = await fastify.mysql.transaction();
            try {
                let treeModel = trx.table('sys_tree');

                let parentData = undefined;

                // 如果传了pid值
                if (req.body.pid) {
                    parentData = await treeModel.clone().where('id', req.body.pid).first();
                    if (parentData === undefined) {
                        return { ...appConfig.httpCode.FAIL, msg: '父级树不存在' };
                    }
                }

                let selfData = await treeModel.clone().where('id', req.body.id).first();
                if (selfData === undefined) {
                    return { ...appConfig.httpCode.FAIL, msg: '菜单不存在' };
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

                await trx.commit();
                await fastify.cacheTreeData();
                return appConfig.httpCode.UPDATE_SUCCESS;
            } catch (err) {
                await trx.rollback();
                fastify.log.error(err);
                return appConfig.httpCode.UPDATE_FAIL;
            }
        }
    });
}
