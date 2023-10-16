// 工具函数
import { fnDbUpdateData, fnApiInfo } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
let apiInfo = await fnApiInfo(import.meta.url);
// 传参验证
export let apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            code: metaConfig.schema.code,
            name: metaConfig.schema.name,
            describe: metaConfig.schema.describe,
            menu_ids: metaConfig.schema.menu_ids,
            api_ids: metaConfig.schema.api_ids
        },
        required: ['name', 'code']
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let roleModel = fastify.mysql.table('sys_role').modify(function (queryBuilder) {});

                let roleData = await roleModel.clone().where('name', req.body.name).orWhere('code', req.body.code).first('id');

                if (roleData?.id) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '角色名称或编码已存在'
                    };
                }

                let insertData = {
                    code: req.body.code,
                    name: req.body.name,
                    describe: req.body.describe,
                    menu_ids: req.body.menu_ids.join(','),
                    api_ids: req.body.api_ids.join(',')
                };
                let result = await roleModel.clone().update(fnDbUpdateData(insertData));

                await fastify.cacheRoleData();

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
