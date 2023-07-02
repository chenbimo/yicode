import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';

import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, options) {
    try {
        await fastify.register(rateLimit, {
            global: appConfig.rate.global || true,
            max: appConfig.rate.max || 3,
            ban: null,
            timeWindow: appConfig.rate.timeWindow || 1000 * 60,
            hook: appConfig.rate.hook || 'onRequest',
            cache: appConfig.rate.cache || 10000,
            allowList: appConfig.rate.allowList || ['127.0.0.1', 'localhost'],
            redis: fastify.redis,
            nameSpace: 'rate:',
            continueExceeding: true,
            skipOnError: true,
            enableDraftSpec: true,
            keyGenerator: function (req) {
                return req.headers['x-real-ip'] || req.headers['x-client-ip'] || req.ip || req.headers['x-forwarded-for'];
            }
        });
    } catch (err) {
        fastify.log.error(err);
    }
}

export default fp(plugin, { name: 'rate', dependencies: ['mysql', 'redis'] });
