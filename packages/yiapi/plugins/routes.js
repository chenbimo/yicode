import fp from 'fastify-plugin';
import fastifyRoutes from '@fastify/routes';

import { appConfig } from '../config/appConfig.js';

async function main(fastify, opts) {
    await fastify.register(fastifyRoutes);
}
export default fp(main, {
    name: 'routes'
});
