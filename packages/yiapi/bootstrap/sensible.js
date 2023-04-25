import fastifySensible from '@fastify/sensible';
import fp from 'fastify-plugin';

async function plugin(fastify, opts) {
    await fastify.register(fastifySensible, {
        errorHandler: false
    });
}
export default fp(plugin, { name: 'sensible' });
