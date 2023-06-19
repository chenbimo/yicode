import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            pid: fnSchema(schemaField.pid, '父级目录ID'),
            name: fnSchema(null, '目录名称', 'string', 1, 30),
            value: fnSchema(schemaField.route, '菜单路由'),
            icon: fnSchema(schemaField.image, '目录图标'),
            sort: fnSchema(schemaField.min0, '目录排序'),
            state: fnSchema(schemaField.state, '目录状态'),
            describe: fnSchema(schemaField.describe, '目录描述'),
            is_open: fnSchema(schemaField.boolEnum, '是否公开')
        },
        required: ['pid', 'name', 'value']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let menuModel = fastify.table.table('sys_menu');

                let parentData = undefined;

                // 如果传了pid值
                if (req.body.pid) {
                    parentData = await menuModel.clone().where('id', req.body.pid).first();
                    if (!parentData) {
                        return {
                            ...codeConfig.FAIL,
                            msg: '父级菜单不存在'
                        };
                    }
                }

                // 需要更新的数据
                let insertData = {
                    pid: req.body.pid,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    describe: req.body.describe,
                    state: req.body.state
                };

                await menuModel.clone().insert(fnClearInsertData(insertData));

                await fastify.cacheTreeData();
                return codeConfig.INSERT_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
}
