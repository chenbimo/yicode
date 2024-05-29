// 工具函数
import { fnRoute } from '../../utils/fnRoute.js';
import { fnSchema } from '../../utils/fnSchema.js';
import { fnRandom6Number } from '../../utils/fnRandom6Number.js';
// 配置文件
import { appConfig } from '../../config/app.js';
import { httpConfig } from '../../config/http.js';
import { schemaHelperConfig } from '../../config/schemaHelper.js';
// 接口元数据
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, metaConfig, {
        // 请求参数约束
        schemaRequest: {
            oneOf: [
                {
                    title: '发送验证码邮件',
                    type: 'object',
                    properties: {
                        to_email: metaConfig.to_email,
                        subject: metaConfig.subject,
                        verify_name: metaConfig.verify_name
                    },
                    required: ['to_email', 'subject', 'verify_name']
                },
                {
                    title: '发送普通邮件',
                    type: 'object',
                    properties: {
                        to_email: metaConfig.to_email,
                        subject: metaConfig.subject,
                        content: metaConfig.content
                    },
                    required: ['to_email', 'subject', 'content']
                }
            ]
        },
        // 执行函数
        apiHandler: async (req, res) => {
            try {
                const mailLogModel = fastify.mysql.table('sys_mail_log');
                // 普通发送
                if (req.body.content) {
                    const result = await fastify.sendEmail({
                        to: req.body.to_email,
                        subject: req.body.subject,
                        text: req.body.content
                    });
                    await mailLogModel.clone().insertData({
                        login_email: appConfig.mail.user,
                        from_name: appConfig.mail.from_name,
                        from_email: appConfig.mail.from_email,
                        to_email: req.body.to_email,
                        email_type: 'common',
                        text_content: req.body.content
                    });
                    return {
                        ...httpConfig.SUCCESS,
                        msg: '邮件已发送',
                        from: 'new'
                    };
                }

                // 发送验证码
                if (req.body.verify_name) {
                    // 如果已经发送过
                    const existsVerifyCode = await fastify.redisGet(`${req.body.verify_name}:${req.body.to_email}`);
                    if (existsVerifyCode) {
                        return {
                            ...httpConfig.SUCCESS,
                            msg: '邮箱验证码已发送（5 分钟有效）',
                            from: 'cache'
                        };
                    }

                    // 如果没有发送过
                    const cacheVerifyCode = fnRandom6Number();
                    await fastify.redisSet(`${req.body.verify_name}:${req.body.to_email}`, cacheVerifyCode, 60 * 5);
                    const result = await fastify.sendEmail({
                        to: req.body.to_email,
                        subject: req.body.subject,
                        text: req.body.subject + '：' + cacheVerifyCode
                    });
                    await mailLogModel.clone().insertData({
                        login_email: appConfig.mail.user,
                        from_name: appConfig.mail.from_name,
                        from_email: appConfig.mail.from_email,
                        to_email: req.body.to_email,
                        email_type: 'verify',
                        text_content: '******'
                    });
                    return {
                        ...httpConfig.SUCCESS,
                        msg: '邮箱验证码已发送（5 分钟有效）',
                        from: 'new'
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                return httpConfig.FAIL;
            }
        }
    });
};
