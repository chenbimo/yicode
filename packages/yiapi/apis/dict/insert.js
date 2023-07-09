import { fnTimestamp, fnClearInsertData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            category_id: metaConfig.schema.category_id,
            category_code: metaConfig.schema.category_code,
            code: metaConfig.schema.code,
            name: metaConfig.schema.name,
            value: metaConfig.schema.value,
            symbol: metaConfig.schema.symbol,
            thumbnail: metaConfig.schema.thumbnail,
            describe: metaConfig.schema.describe,
            state: metaConfig.schema.state
        },
        required: [
            //
            'category_id',
            'category_code',
            'code',
            'name',
            'value',
            'symbol'
        ]
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
                            ...codeConfig.UPDATE_FAIL,
                            msg: '字典值不是一个数字类型'
                        };
                    }
                }

                let dictModel = fastify.mysql.table('sys_dict');

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
                    ...codeConfig.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
}
