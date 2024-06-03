// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnUUID } from '../../utils/fnUUID.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 数据表格
// 接口元数据
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                product_code: fnSchema({ name: '产品名称', type: 'string', min: 1, max: 100 }),
                online_uuid: fnSchema({ name: '会话ID', type: 'string', min: 1, max: 100 })
            },
            required: ['product_code']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                if (req.session.id) {
                    fastify.redisSet(`online:${req.body.product_code}:${req.session.id}`, req.session.id, 300);
                    return {
                        ...httpConfig.SUCCESS,
                        msg: '设置在线状态成功',
                        detail: '登录会话'
                    };
                } else {
                    if (req.body.online_uuid) {
                        fastify.redisSet(`online:${req.body.product_code}:${req.body.online_uuid}`, req.body.online_uuid, 300);
                        return {
                            ...httpConfig.SUCCESS,
                            msg: '设置在线状态成功',
                            detail: '复用会话'
                        };
                    } else {
                        const uuid = fnUUID();
                        fastify.redisSet(`online:${req.body.product_code}:${uuid}`, uuid, 300);
                        return {
                            ...httpConfig.SUCCESS,
                            msg: '设置在线状态成功',
                            data: uuid,
                            detail: '初始会话'
                        };
                    }
                }
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
