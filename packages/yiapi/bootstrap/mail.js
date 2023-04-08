import fp from 'fastify-plugin';
import nodemailer from 'nodemailer';
import { mailConfig } from '../config/mail.js';

async function plugin(fastify, opts) {
    let mailTransport = await nodemailer.createTransport({
        host: mailConfig.host,
        port: mailConfig.post,
        pool: mailConfig.pool,
        secure: mailConfig.secure,
        auth: {
            user: mailConfig.user,
            pass: mailConfig.pass
        }
    });

    // 发送邮件
    function sendMail(params) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await mailTransport.sendMail({
                    from: mailConfig.from,
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
