import fp from 'fastify-plugin';
import fastifyRedis from '../preboot/redis.js';

import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, opts) {
    await fastify.register(fastifyRedis, appConfig.redis);
}
export default fp(plugin, { name: 'redis' });
