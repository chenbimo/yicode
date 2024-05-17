import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, options) {
    try {
        await fastify.register(rateLimit, {
            global: appConfig.rate.global || true,
            max: appConfig.rate.max || 100,
            ban: null,
            timeWindow: appConfig.rate.timeWindow || 1000 * 10,
            hook: appConfig.rate.hook || 'onRequest',
            cache: appConfig.rate.cache || 10000,
            allowList: appConfig.rate.allowList || ['127.0.0.1', 'localhost'],
            redis: null,
            nameSpace: appConfig.rate.namespace || 'test_rate:',
            continueExceeding: true,
            skipOnError: true,
            keyGenerator: function (req) {
                return req.headers['x-real-ip'] || req.headers['x-client-ip'] || req.ip || req.headers['x-forwarded-for'];
            },
            onExceeded(req, key) {
                fastify.log.warn({
                    key: key,
                    message: '请求过快',
                    apiPath: req?.url,
                    session: req?.session,
                    reqId: req?.id
                });
            }
        });
    } catch (err) {
        fastify.log.error(err);
    }
}

export default fp(plugin, { name: 'rate', dependencies: ['mysql', 'redis'] });
