import { fnApiInfo, fnRandom6Number, fnClearInsertData } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `发送邮箱注册验证码`,
    tags: [apiInfo.parentDirName],
    body: {
        oneOf: [
            {
                title: '发送验证码邮件',
                type: 'object',
                properties: {
                    to_email: metaConfig.schema.to_email,
                    email_type: metaConfig.schema.email_type,
                    subject: metaConfig.schema.subject,
                    verify_name: metaConfig.schema.verify_name
                },
                required: ['to_email', 'email_type', 'subject', 'verify_name']
            },
            {
                title: '发送普通邮件',
                type: 'object',
                properties: {
                    to_email: metaConfig.schema.to_email,
                    email_type: metaConfig.schema.email_type,
                    subject: metaConfig.schema.subject,
                    content: metaConfig.schema.content
                },
                required: ['to_email', 'email_type', 'subject', 'content']
            }
        ]
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let mailLogModel = fastify.mysql.table('sys_mail_log');
                // 普通发送
                if (req.body.content) {
                    let result = await fastify.sendEmail({
                        to: req.body.to_email,
                        subject: req.body.subject,
                        text: req.body.content
                    });
                    await mailLogModel.clone().insert(
                        fnClearInsertData({
                            login_email: appConfig.mail.user,
                            from_name: appConfig.mail.from_name,
                            from_email: appConfig.mail.from_email,
                            to_email: req.body.to_email,
                            email_type: req.body.email_type,
                            text: req.body.content
                        })
                    );
                    return {
                        ...codeConfig.SUCCESS,
                        msg: '邮件已发送',
                        from: 'new'
                    };
                }

                // 发送验证码
                if (req.body.verify_name) {
                    // 如果已经发送过
                    let existsVerifyCode = await fastify.redisGet(`${req.body.verify_name}:${req.body.to_email}`);
                    if (existsVerifyCode) {
                        return {
                            ...codeConfig.SUCCESS,
                            msg: '邮箱验证码已发送（3分钟有效）',
                            from: 'cache'
                        };
                    }

                    // 如果没有发送过
                    let cacheVerifyCode = fnRandom6Number();
                    await fastify.redisSet(`${req.body.verify_name}:${req.body.to_email}`, cacheVerifyCode, 60 * 3);
                    let result = await fastify.sendEmail({
                        to: req.body.to_email,
                        subject: req.body.subject,
                        text: req.body.subject + '：' + cacheVerifyCode
                    });

                    await mailLogModel.clone().insert(
                        fnClearInsertData({
                            login_email: appConfig.mail.user,
                            from_name: appConfig.mail.from_name,
                            from_email: appConfig.mail.from_email,
                            to_email: req.body.to_email,
                            email_type: req.body.email_type,
                            text: '******'
                        })
                    );
                    return {
                        ...codeConfig.SUCCESS,
                        msg: '邮箱验证码已发送（3分钟有效）',
                        from: 'new'
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.FAIL;
            }
        }
    });
}
