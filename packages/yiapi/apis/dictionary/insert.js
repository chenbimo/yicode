import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo, fnCamelCase } from '../../utils/index.js';

import { mapTableConfig } from '../../config/mapTable.js';
import { constantConfig } from '../../config/constant.js';
import { schemaConfig } from '../../config/schema.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            category: fnSchema(schemaConfig.category, '字典分类'),
            code: fnSchema(schemaConfig.code, '字典编码'),
            name: fnSchema(null, '字典名称', 'string', 1, 20),
            value: fnSchema(null, '字典值', 'string', 0, 500),
            symbol: fnSchema(null, '字典符号', 'string', 0, 20),
            thumbnail: fnSchema(schemaConfig.image, '字典缩略图'),
            image_lists: fnSchema(schemaConfig.image_lists, '字典轮播图'),
            describe: fnSchema(null, '字典描述', 'string', 0, 300),
            content: fnSchema(schemaConfig.content, '字典正文'),
            state: fnSchema(schemaConfig.state, '是否启用')
        },
        required: ['category', 'code', 'name', 'value', 'symbol']
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
            try {
                // 如果传的值是数值类型，则判断是否为有效数值
                if (req.body.symbol === 'number') {
                    if (Number.isNaN(Number(req.body.value)) === true) {
                        return { ...constantConfig.code.UPDATE_FAIL, msg: '字典值不是一个数字类型' };
                    }
                }

                let dictionaryModel = fastify.mysql.table(mapTableConfig.sys_dictionary);

                let data = {
                    category: fnCamelCase(req.body.category),
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    value: req.body.value,
                    symbol: req.body.symbol,
                    thumbnail: req.body.thumbnail,
                    images: req.body.images,
                    describe: req.body.describe,
                    content: req.body.content,
                    state: req.body.content
                };

                let result = await dictionaryModel.insert(fnClearInsertData(data));

                return {
                    ...constantConfig.code.INSERT_SUCCESS,
                    data: result
                };
            } catch (err) {
                fastify.log.error(err);
                return constantConfig.code.INSERT_FAIL;
            }
        }
    });
}
