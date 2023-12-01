// 工具函数
import { fnRoute, fnCamelCase } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '更新字典';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.schema.id,
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
            required: ['id']
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                if (req.body.type === 'number') {
                    if (Number.isNaN(Number(req.body.value)) === true) {
                        return {
                            ...codeConfig.UPDATE_FAIL,
                            msg: '字典值不是一个数字类型'
                        };
                    }
                }
                const dictModel = fastify.mysql.table('sys_dict').modify(function (qb) {});

                const result = await dictModel //
                    .clone()
                    .where({ id: req.body.id })
                    .updateData({
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

                return codeConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.UPDATE_FAIL;
            }
        }
    });
};
