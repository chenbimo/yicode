import fp from 'fastify-plugin';
import path from 'path';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fg from 'fast-glob';

import { appConfig } from '../config/app.js';

async function main(fastify, opts) {
    await fastify.register(fastifySwagger, {
        mode: 'dynamic',
        swagger: {
            info: {
                title: `${appConfig.appName}接口文档`,
                description: `${appConfig.appName}接口文档`,
                version: '1.0.0'
            },
            host: 'localhost',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json']
        }
    });

    await fastify.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        initOAuth: {},
        uiConfig: {
            docExpansion: 'none',
            deepLinking: false
        },
        staticCSP: true
    });
}
export default fp(main, { name: 'swagger' });
