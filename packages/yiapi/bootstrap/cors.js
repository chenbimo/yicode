import fp from 'fastify-plugin';
import fastifyCors from '@fastify/cors';
import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, opts) {
    await fastify.register(fastifyCors, function (instance) {
        return (req, callback) => {
            // 默认跨域，如果需要指定请求前缀，可以被传入的参数覆盖
            let newCorsConfig = {
                origin: req.headers.origin || req.headers.host || '*',
                ...appConfig.cors
            };

            callback(null, newCorsConfig);
        };
    });
}
export default fp(plugin, { name: 'cors' });
