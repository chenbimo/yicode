// 工具函数
import { fnRoute, fnRandom6Number } from '../../utils/index.js';
// 配置文件
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

// 处理函数
export default async (fastify) => {
    // 当前文件的路径，fastify 实例
    fnRoute(import.meta.url, fastify, {
        // 接口名称
        apiName: '发送邮件',
        // 请求参数约束
        schemaRequest: {
            oneOf: [
                {
                    title: '发送验证码邮件',
                    type: 'object',
                    properties: {
                        to_email: metaConfig.schema.to_email,
                        subject: metaConfig.schema.subject,
                        verify_name: metaConfig.schema.verify_name
                    },
                    required: ['to_email', 'subject', 'verify_name']
                },
                {
                    title: '发送普通邮件',
                    type: 'object',
                    properties: {
                        to_email: metaConfig.schema.to_email,
                        subject: metaConfig.schema.subject,
                        content: metaConfig.schema.content
                    },
                    required: ['to_email', 'subject', 'content']
                }
            ]
        },
        // 返回数据约束
        schemaResponse: {},
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
                        ...codeConfig.SUCCESS,
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
                            ...codeConfig.SUCCESS,
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
                        ...codeConfig.SUCCESS,
                        msg: '邮箱验证码已发送（5 分钟有效）',
                        from: 'new'
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
};
