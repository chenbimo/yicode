import fp from 'fastify-plugin';
import nodemailer from 'nodemailer';
import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, opts) {
    const mailTransport = await nodemailer.createTransport({
        host: appConfig.mail.host,
        port: appConfig.mail.post,
        pool: appConfig.mail.pool,
        secure: appConfig.mail.secure,
        auth: {
            user: appConfig.mail.user,
            pass: appConfig.mail.pass
        }
    });

    // 发送邮件
    function sendMail(params) {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await mailTransport.sendMail({
                    from: {
                        name: appConfig.mail.from_name,
                        address: appConfig.mail.from_email
                    },
                    ...params
                });
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    fastify.decorate('sendEmail', sendMail);
}
export default fp(plugin, { name: 'email' });
