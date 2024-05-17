// 内部模块
// 外部模块
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';
// 配置文件
import { jwtConfig } from '../config/jwt.js';

async function plugin(fastify) {
    await fastify.register(fastifyJwt, {
        secret: jwtConfig.secret,
        decoratorName: 'session',
        decode: {
            complete: true
        },
        sign: {
            algorithm: 'HS256',
            expiresIn: jwtConfig.expiresIn
        },
        verify: {
            algorithms: ['HS256']
        }
    });
}
export default fp(plugin, { name: 'jwt' });
