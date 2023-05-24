import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { httpCodeConfig } from '../../config/httpCodeConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    tags: [apiInfo.parentDirName],
    summary: `删除${metaConfig.name}`,
    body: {
        title: `删除${metaConfig.name}接口`,
        type: 'object',
        properties: {
            id: fnSchema(sysConfig.schemaField.id, '唯一ID')
        },
        required: ['id']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let menuModel = fastify.mysql //
                    .table('sys_menu');

                let menuData = await menuModel.clone().where({ id: req.body.id }).first();

                if (!menuData) {
                    return {
                        ...httpCodeConfig.DELETE_FAIL,
                        msg: '菜单不存在'
                    };
                }

                let childData = await menuModel.clone().where({ pid: req.body.id }).first();

                if (childData) {
                    return {
                        ...httpCodeConfig.DELETE_FAIL,
                        msg: '存在子菜单，无法删除'
                    };
                }

                if (menuData.is_system === 1) {
                    return {
                        ...httpCodeConfig.DELETE_FAIL,
                        msg: '默认菜单，无法删除'
                    };
                }

                let result = await menuModel.clone().where({ id: req.body.id }).delete();
                await fastify.cacheTreeData();
                return {
                    ...httpCodeConfig.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return httpCodeConfig.DELETE_FAIL;
            }
        }
    });
}
