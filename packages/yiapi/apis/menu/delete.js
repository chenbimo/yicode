import { fnSchema, fnApiInfo } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
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
                let dictionaryModel = fastify.mysql //
                    .table(appConfig.table.sys_menu)
                    .where({ id: req.body.id });

                let dictionaryData = await dictionaryModel.clone().first();

                if (!dictionaryData) {
                    return {
                        ...appConfig.httpCode.DELETE_FAIL,
                        msg: '菜单不存在'
                    };
                }

                if (dictionaryData.is_system === 1) {
                    return {
                        ...appConfig.httpCode.DELETE_FAIL,
                        msg: '默认菜单，无法删除'
                    };
                }

                let result = await dictionaryModel.clone().delete();

                await fastify.cacheTreeData();
                return {
                    ...appConfig.httpCode.DELETE_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return appConfig.httpCode.DELETE_FAIL;
            }
        }
    });
}
