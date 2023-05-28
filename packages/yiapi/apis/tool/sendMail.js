import { fnApiInfo, fnRandom6Number, fnSchema } from '../../utils/index.js';

import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `发送邮箱注册验证码`,
    tags: [apiInfo.parentDirName],
    body: {
        title: '发送邮箱注册验证码接口',
        type: 'object',
        properties: {
            email: fnSchema(schemaField.email, '邮箱地址'),
            type: fnSchema(schemaField.string1to30, '验证码类型'),
            text: fnSchema(schemaField.string1to100, '提示文字')
        },
        required: ['email', 'type', 'text']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                // 如果已经发送过
                let existsVerifyCode = await fastify.redisGet(`${req.body.type}:${req.body.email}`);
                if (existsVerifyCode) {
                    return {
                        ...codeConfig.SUCCESS,
                        msg: '邮箱验证码已发送（3分钟有效）'
                    };
                }

                // 如果没有发送过
                let cacheVerifyCode = fnRandom6Number();
                await fastify.redisSet(`${req.body.type}:${req.body.email}`, cacheVerifyCode, 60 * 3);
                let emailResult = await fastify.sendEmail({
                    to: req.body.email,
                    subject: req.body.text,
                    text: req.body.text + cacheVerifyCode
                });

                return {
                    ...codeConfig.SUCCESS,
                    msg: '邮箱验证码已发送（3分钟有效）',
                    from: 'new'
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
}
