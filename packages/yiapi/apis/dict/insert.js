import { fnRoute, fnCamelCase } from '../../utils/index.js';

import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '添加字典',
        // 请求参数约束
        schemaRequest: {
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
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
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

                const dictModel = fastify.mysql.table('sys_dict');

                const result = await dictModel.insertData({
                    category_id: req.body.category_id,
                    category_code: fnCamelCase(req.body.category_code),
                    code: fnCamelCase(req.body.code),
                    name: req.body.name,
                    value: req.body.value,
                    symbol: req.body.symbol,
                    thumbnail: req.body.thumbnail,
                    describe: req.body.describe,
                    state: req.body.state
                });

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
};
