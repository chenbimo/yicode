// 工具函数
import { fnRoute, fnUUID } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

export const apiName = '微信消息通知';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        method: 'get',
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                if (req.query.echostr) {
                    // 第一次认证微信
                    return req.query?.echostr || 'SUCCESS';
                } else {
                    //
                    return 'SUCCESS';
                }
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });

    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: apiName,
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },
        // 返回数据约束
        schemaResponse: {},
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const xmlData = req.body.xml || {};
                fastify.log.warn(req.body);
                if (!xmlData?.EventKey) {
                    xmlData.EventKey = 'test';
                }

                // 扫描公众号二维码登录
                if (xmlData.EventKey.indexOf('scan_qrcode_login') !== -1) {
                    let [
                        //
                        scene_value,
                        qrcode_uuid
                    ] = xmlData.EventKey?.split('#') || [];

                    const userModel = fastify.mysql.table('sys_user');

                    // 查询用户是否存在
                    const userData = await userModel //
                        .clone()
                        .where({ openid: xmlData.FromUserName })
                        .selectOne('id');

                    // 如果用户已存在，则返回
                    if (userData?.id) {
                        // 若用户不存在则创建该用户
                        await fastify.redisSet(`scanQrcodeLogin:${qrcode_uuid}`, xmlData.FromUserName, 60);
                    } else {
                        // 若用户不存在则创建该用户
                        await userModel //
                            .clone()
                            .insertData({
                                openid: xmlData.FromUserName,
                                nickname: '用户' + fnUUID(10),
                                role_codes: 'user'
                            });
                        await fastify.redisSet(`scanQrcodeLogin:${qrcode_uuid}`, xmlData.FromUserName, 60);
                    }
                }
                return 'SUCCESS';
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
};
