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
            name: metaConfig.schema.name,
            value: metaConfig.schema.value,
            icon: metaConfig.schema.icon,
            sort: metaConfig.schema.sort,
            state: metaConfig.schema.state,
            describe: metaConfig.schema.describe,
            is_open: metaConfig.schema.is_open
        },
        required: ['pid', 'name', 'value']
    }
};
// 处理函数
export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                const menuModel = fastify.mysql.table('sys_menu');

                // 如果传了pid值，则判断父级是否存在
                if (req.body.pid) {
                    const parentData = await menuModel.clone().where('id', req.body.pid).first('id');
                    if (!parentData?.id) {
                        return {
                            ...codeConfig.FAIL,
                            msg: '父级菜单不存在'
                        };
                    }
                }

                // 需要更新的数据
                const insertData = {
                    pid: req.body.pid,
                    name: req.body.name,
                    value: req.body.value,
                    icon: req.body.icon,
                    sort: req.body.sort,
                    is_open: req.body.is_open,
                    describe: req.body.describe,
                    state: req.body.state
                };

                await menuModel.clone().insert(fnDbInsertData(insertData));

                await fastify.cacheTreeData();
                return codeConfig.INSERT_SUCCESS;
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
}
