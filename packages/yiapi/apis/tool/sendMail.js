import { fnApiInfo, fnRandom6Number, fnSchema, fnClearInsertData } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `发送邮箱注册验证码`,
    tags: [apiInfo.parentDirName],
    body: {
        // title: '发送邮箱注册验证码接口',
        // type: 'object',
        oneOf: [
            {
                title: '发送验证码邮件',
                type: 'object',
                properties: {
                    to_email: fnSchema(schemaField.email, '邮箱地址'),
                    email_type: fnSchema(null, '邮件类型', 'string', null, null, ['common', 'verify']),
                    subject: fnSchema(schemaField.string1to200, '邮件标题'),
                    verify_name: {
                        title: '验证码名称',
                        type: 'string',
                        minLength: 2,
                        maxLength: 30,
                        pattern: '^[a-z][a-zA-Z0-9]*$'
                    }
                },
                required: ['to_email', 'email_type', 'subject', 'verify_name']
            },
            {
                title: '发送普通邮件',
                type: 'object',
                properties: {
                    to_email: fnSchema(schemaField.email, '邮箱地址'),
                    email_type: fnSchema(null, '邮件类型', 'string', null, null, ['common', 'verify']),
                    subject: fnSchema(schemaField.string1to200, '邮件标题'),
                    content: fnSchema(schemaField.string1to100, '邮件内容')
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
            const trx = await fastify.mysql.transaction();
            try {
                let mailLogModel = trx.table('sys_mail_log');
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
                    await trx.commit();
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
                        await trx.commit();
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
                    await trx.commit();
                    return {
                        ...codeConfig.SUCCESS,
                        msg: '邮箱验证码已发送（3分钟有效）',
                        from: 'new'
                    };
                }
            } catch (err) {
                fastify.log.error(err);
                await trx.rollback();
                return codeConfig.FAIL;
            }
        }
    });
}
