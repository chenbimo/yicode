import fp from 'fastify-plugin';
import Redis from 'ioredis';

import { appConfig } from '../config/appConfig.js';

function close(fastify) {
    return fastify.redis.quit();
}

function plugin(fastify, opts, next) {
    let client = null;

    if (fastify.redis) {
        return next(new Error('Redis 已注册'));
    } else {
        try {
            client = new Redis(appConfig.redis);
        } catch (err) {
            return next(err);
        }

        fastify.addHook('onClose', close);

        fastify.decorate('redis', client);
    }

    // Testing this make the process crash on latest TAP :(
    /* istanbul ignore next */
    const onEnd = function (err) {
        client.off('ready', onReady).off('error', onError).off('end', onEnd).quit();

        next(err);
    };

    const onReady = function () {
        client.off('end', onEnd).off('error', onError).off('ready', onReady);

        next();
    };

    // Testing this make the process crash on latest TAP :(
    /* istanbul ignore next */
    const onError = function (err) {
        if (err.code === 'ENOTFOUND') {
            onEnd(err);
            return;
        }

        // Swallow network errors to allow ioredis
        // to perform reconnection and emit 'end'
        // event if reconnection eventually
        // fails.
        // Any other errors during startup will
        // trigger the 'end' event.
        if (err instanceof Redis.ReplyError) {
            onEnd(err);
        }
    };

    // ioredis provides it in a .status property
    if (client.status === 'ready') {
        // client is already connected, do not register event handlers
        // call next() directly to avoid ERR_AVVIO_PLUGIN_TIMEOUT
        next();
    } else {
        // ready event can still be emitted
        client.on('end', onEnd).on('error', onError).on('ready', onReady);

        client.ping();
    }
}
export default fp(plugin, { name: 'redis' });
