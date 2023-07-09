import { fnClearUpdateData, fnApiInfo } from '../../utils/index.js';

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
            name: metaConfig.schema.name,
            value: metaConfig.schema.value,
            icon: metaConfig.schema.icon,
            sort: metaConfig.schema.sort,
            state: metaConfig.schema.state,
            describe: metaConfig.schema.describe,
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
                let menuModel = fastify.mysql.table('sys_menu');

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

                let selfData = await menuModel.clone().where('id', req.body.id).first();
                if (selfData === undefined) {
                    return {
                        ...codeConfig.FAIL,
                        msg: '菜单不存在'
                    };
                }

                // 需要更新的数据
                let updateData = {
                    pid: req.body.pid,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    describe: req.body.describe,
                    state: req.body.state
                };

                let res = await menuModel
                    //
                    .clone()
                    .where({ id: req.body.id })
                    .update(fnClearUpdateData(updateData));

                await fastify.cacheTreeData();
                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
}
