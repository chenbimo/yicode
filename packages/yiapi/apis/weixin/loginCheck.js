// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnField } from '../../utils/fnField.js';
// 配置文件
import { httpConfig } from '../../config/http.js';
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {
                scan_qrcode_uuid: metaConfig.scan_qrcode_uuid
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
                        .selectOne(...fnField('user', 'core', ['password']));
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
