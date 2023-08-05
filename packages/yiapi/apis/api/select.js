// 工具函数
import { fnApiInfo, fnPageOffset, fnSelectFields } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 选择字段
let selectKeys = fnSelectFields('./tables/api.json');
// 传参校验
export let apiSchema = {
    summary: `查询${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}接口`,
        type: 'object',
        properties: {
            page: metaConfig.schema.page,
            limit: metaConfig.schema.limit
        }
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let apiModel = fastify.mysql //
                    .table('sys_api')
                    .modify(function (queryBuilder) {});

                let { total } = await apiModel.clone().count('id', { as: 'total' }).first();

                let rows = await apiModel
                    //
                    .clone()
                    .orderBy('created_at', 'desc')
                    .offset(fnPageOffset(req.body.page, req.body.limit))
                    .limit(req.body.limit)
                    .select(selectKeys);

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
