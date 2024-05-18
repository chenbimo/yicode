import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

import { rateConfig } from '../config/rate.js';

async function plugin(fastify, options) {
    try {
        await fastify.register(rateLimit, {
            global: rateConfig.global || true,
            max: rateConfig.max || 100,
            ban: null,
            timeWindow: rateConfig.timeWindow || 1000 * 10,
            hook: rateConfig.hook || 'onRequest',
            cache: rateConfig.cache || 10000,
            allowList: rateConfig.allowList || ['127.0.0.1', 'localhost'],
            redis: null,
            nameSpace: rateConfig.namespace || 'test_rate:',
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

export default fp(plugin, { name: 'rate', dependencies: ['redis'] });
