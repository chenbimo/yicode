import fp from 'fastify-plugin';
import fastifyMultipart from '@fastify/multipart';
import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, options) {
    await fastify.register(fastifyMultipart, {
        attachFieldsToBody: true,
        limits: {
            fieldNameSize: 100,
            fieldSize: 100,
            fields: 10,
            fileSize: 100000000, // 文件最大为100M
            files: 1,
            headerPairs: 2000,
            parts: 1000
        }
    });
}

export default fp(plugin, {
    name: 'upload'
});
