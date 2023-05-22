import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

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
            category_id: fnSchema(sysConfig.schemaField.min1, '字典分类ID'),
            category_code: fnSchema(sysConfig.schemaField.category, '字典分类'),
            code: fnSchema(sysConfig.schemaField.code, '字典编码'),
            name: fnSchema(null, '字典名称', 'string', 1, 20),
            value: fnSchema(null, '字典值', 'string', 0, 500),
            symbol: fnSchema(null, '字典符号', 'string', 0, 20, ['string', 'number']),
            thumbnail: fnSchema(sysConfig.schemaField.image, '字典缩略图'),
            describe: fnSchema(null, '字典描述', 'string', 0, 300),
            state: fnSchema(sysConfig.schemaField.state, '是否启用')
        },
        required: ['category_id', 'category_code', 'code', 'name', 'value', 'symbol']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                // 如果传的值是数值类型，则判断是否为有效数值
                if (req.body.symbol === 'number') {
                    if (Number.isNaN(Number(req.body.value)) === true) {
                        return {
                            ...appConfig.httpCode.UPDATE_FAIL,
                            msg: '字典值不是一个数字类型'
                        };
                    }
                }

                let dictModel = fastify.mysql.table(appConfig.table.sys_dict);

                let data = {
                    category_id: req.body.category_id,
                    category_code: fnCamelCase(req.body.category_code),
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    value: req.body.value,
                    symbol: req.body.symbol,
                    thumbnail: req.body.thumbnail,
                    describe: req.body.describe,
                    state: req.body.state
                };

                let result = await dictModel.insert(fnClearInsertData(data));

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
