// 内部函数
import { resolve } from 'node:path';
// 外部函数
import { yd_is_function } from '@yicode/yidash';
// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnImportAbsolutePath } from '../../utils/fnImportAbsolutePath.js';
import { fnUUID } from '../../utils/fnUUID.js';
// 配置文件
import { system } from '../../system.js';
import { appConfig } from '../../config/app.js';
import { httpConfig } from '../../config/http.js';
// 接口元数据
import { metaConfig } from './_meta.js';

export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求方法
        method: 'get',
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },
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
                return httpConfig.FAIL;
            }
        }
    });

    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            type: 'object',
            properties: {}
        },

        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const xmlData = req.body.xml || {};
                fastify.log.warn(req.body);
                if (!xmlData?.EventKey) {
                    xmlData.EventKey = 'test';
                }
                const { callbackConfig } = await fnImportAbsolutePath(resolve(system.appDir, 'config', 'callback.js'), 'callbackConfig', {});

                // 扫描公众号二维码登录
                if (xmlData.EventKey.indexOf('scan_qrcode_login') !== -1) {
                    const [
                        //
                        scene_value,
                        qrcode_uuid,
                        agent_id,
                        product_code
                    ] = xmlData.EventKey?.split('#') || [];

                    const userModel = fastify.mysql.table('sys_user');

                    // 查询用户是否存在
                    const userData = await userModel //
                        .clone()
                        .where({ openid: xmlData.FromUserName })
                        .selectOne(['id']);

                    // 如果用户已存在，则返回
                    if (userData?.id) {
                        // 若用户不存在则创建该用户
                        await fastify.redisSet(`scanQrcodeLogin:${qrcode_uuid}`, xmlData.FromUserName, 120);
                        if (yd_is_function(callbackConfig.weixinMessage)) {
                            callbackConfig.weixinMessage(fastify, {
                                new_user: 0,
                                user_id: userData?.id,
                                scene_value: scene_value,
                                qrcode_uuid: qrcode_uuid,
                                agent_id: agent_id || 0,
                                product_code: product_code || 0
                            });
                        }
                    } else {
                        // 若用户不存在则创建该用户
                        const result = await userModel //
                            .clone()
                            .insertData({
                                openid: xmlData.FromUserName,
                                nickname: '用户' + fnUUID(10),
                                role: 'user',
                                agent_id: agent_id || 0,
                                from_product: product_code || 0
                            });
                        await fastify.redisSet(`scanQrcodeLogin:${qrcode_uuid}`, xmlData.FromUserName, 120);
                        if (yd_is_function(callbackConfig.weixinMessage)) {
                            callbackConfig.weixinMessage(fastify, {
                                new_user: 1,
                                user_id: result?.[0] || 0,
                                scene_value: scene_value,
                                qrcode_uuid: qrcode_uuid,
                                agent_id: agent_id || 0,
                                product_code: product_code || 0
                            });
                        }
                    }
                }
                return 'SUCCESS';
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
