// 工具函数
import { fnDbInsertData, fnApiInfo } from '../../utils/index.js';
// 配置文件
import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';
// 接口信息
const apiInfo = await fnApiInfo(import.meta.url);
// 传参验证
export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            pid: metaConfig.schema.pid,
            category: metaConfig.schema.category,
            name: metaConfig.schema.name,
            value: metaConfig.schema.value,
            icon: metaConfig.schema.icon,
            sort: metaConfig.schema.sort,
            describe: metaConfig.schema.describe,
            is_bool: metaConfig.schema.is_bool,
            is_open: metaConfig.schema.is_open
        },
        required: ['pid', 'category', 'name']
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                const treeModel = fastify.mysql.table('sys_tree').modify(function (queryBuilder) {});

                if (req.body.pid === 0) {
                    req.body.pids = '0';
                    req.body.level = 1;
                } else {
                    const parentData = await treeModel.clone().where('id', req.body.pid).first('id', 'pids');
                    if (!parentData?.id) {
                        return {
                            ...codeConfig.FAIL,
                            msg: '父级树不存在'
                        };
                    }
                    req.body.pids = `${parentData.pids},${parentData.id}`;
                    req.body.level = req.body.pids.split(',').length;
                }

                const insertData = {
                    pid: req.body.pid,
                    category: req.body.category,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    is_bool: req.body.is_bool,
                    describe: req.body.describe,
                    pids: req.body.pids,
                    level: req.body.level
                };
                const result = await treeModel
                    //
                    .clone()
                    .insert(fnDbInsertData(insertData));

                await fastify.cacheTreeData();

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
