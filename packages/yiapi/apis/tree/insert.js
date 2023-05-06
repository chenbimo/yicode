import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            pid: fnSchema(sysConfig.schemaField.pid, '父级目录ID'),
            category: fnSchema(sysConfig.schemaField.category, '目录分类'),
            name: fnSchema(null, '目录名称', 'string', 1, 30),
            value: fnSchema(null, '目录值', 'string', 0, 300),
            icon: fnSchema(sysConfig.schemaField.image, '目录图标'),
            sort: fnSchema(sysConfig.schemaField.min1, '目录排序'),
            describe: fnSchema(sysConfig.schemaField.describe, '目录描述'),
            is_bool: fnSchema(sysConfig.schemaField.boolEnum, '是否虚拟目录'),
            is_open: fnSchema(sysConfig.schemaField.boolEnum, '是否公开')
        },
        required: ['pid', 'category', 'name']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        config: {},
        handler: async function (req, res) {
            try {
                let model = fastify.mysql //
                    .table(appConfig.table.sys_tree)
                    .modify(function (queryBuilder) {});
                if (req.body.pid === 0) {
                    req.body.pids = '0';
                    req.body.level = 1;
                } else {
                    let parentPermission = await model.clone().where('id', req.body.pid).first();
                    if (!parentPermission) {
                        return { ...appConfig.httpCode.FAIL, msg: '父级树不存在' };
                    }
                    req.body.pids = `${parentPermission.pids},${parentPermission.id}`;
                    req.body.level = req.body.pids.split(',').length;
                }

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
                    pids: req.body.pids,
                    level: req.body.level
                };
                let result = await model
                    //
                    .clone()
                    .insert(fnClearInsertData(data));

                await fastify.cacheTreeData();

                return {
                    ...appConfig.httpCode.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.INSERT_FAIL;
            }
        }
    });
}
