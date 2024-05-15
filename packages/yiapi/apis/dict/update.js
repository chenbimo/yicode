// 工具函数
import { fnRoute, fnCamelCase } from '../../utils/index.js';
// 配置文件
import { httpConfig } from '../../config/httpConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                id: metaConfig.id,
                category_id: metaConfig.category_id,
                category_code: metaConfig.category_code,
                code: metaConfig.code,
                name: metaConfig.name,
                value: metaConfig.value,
                symbol: metaConfig.symbol,
                thumbnail: metaConfig.thumbnail,
                describe: metaConfig.describe
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
                            ...httpConfig.UPDATE_FAIL,
                            msg: '字典值不是一个数字类型'
                        };
                    }
                }
                const dictModel = fastify.mysql.table('sys_dict').modify(function (db) {});

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
                        describe: req.body.describe
                    });

                return httpConfig.UPDATE_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.UPDATE_FAIL;
            }
        }
    });
};
