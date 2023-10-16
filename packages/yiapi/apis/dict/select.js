// 工具函数
import { fnApiInfo, fnPageOffset, fnSelectFields } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 选择字段
let selectKeys = fnSelectFields('./tables/dict.json');
// 传参校验
export let apiSchema = {
    summary: `查询${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}接口`,
        type: 'object',
        properties: {
            page: metaConfig.schema.page,
            limit: metaConfig.schema.limit,
            state: metaConfig.schema.state,
            category_code: metaConfig.schema.category_code
        },
        required: ['category_code']
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let dictModel = fastify.mysql //
                    .table('sys_dict')
                    .where('category_code', req.body.category_code)
                    .modify(function (queryBuilder) {
                        if (req.body.keyword !== undefined) {
                            queryBuilder.where('name', 'like', `%${req.body.keyword}%`);
                        }
                        if (req.body.state !== undefined) {
                            queryBuilder.where('state', req.body.state);
                        }
                    });

                // 记录总数
                let { total } = await dictModel.clone().count('id', { as: 'total' }).first();

                // 记录列表
                let resultData = await dictModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select(selectKeys);

                // 处理数字符号强制转换为数字值
                let rows = resultData.map((item) => {
                    if (item.symbol === 'number') {
                        item.value = Number(item.value);
                    }
                    return item;
                });

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        total: total,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
