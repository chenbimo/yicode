// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { toOmit } from '../../utils/toOmit.js';
import { getDbFields } from '../../utils/getDbFields.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
// 数据表格
import { tableData } from '../../tables/user.js';
// 接口元数据
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                scan_qrcode_uuid: fnSchema({ name: '扫码识别号', schema: { type: 'string', min: 5, max: 50 } })
            },
            required: ['scan_qrcode_uuid']
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const openid = await fastify.redisGet(`scanQrcodeLogin:${req.body.scan_qrcode_uuid}`);
                if (openid) {
                    const userModel = fastify.mysql //
                        .table('sys_user')
                        .where({ openid: openid });
                    // 查询用户是否存在
                    const userData = await userModel //
                        .clone()
                        .selectOne(getDbFields(tableData, ['password']));
                    if (userData?.id) {
                        return {
                            ...httpConfig.SUCCESS,
                            data: userData,
                            token: await fastify.jwt.sign({
                                id: userData.id,
                                nickname: userData.nickname,
                                role_type: 'user',
                                role: userData.role
                            })
                        };
                    } else {
                        return {
                            ...httpConfig.SUCCESS,
                            msg: '暂无数据',
                            detail: '暂无数据 2',
                            data: {}
                        };
                    }
                } else {
                    return {
                        ...httpConfig.SUCCESS,
                        msg: '暂无数据',
                        detail: '暂无数据 1',
                        data: {}
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
