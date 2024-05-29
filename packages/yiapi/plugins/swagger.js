import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

import { appConfig } from '../config/app.js';

async function plugin(fastify, opts) {
    await fastify.register(fastifySwagger, {
        mode: 'dynamic',
        swagger: {
            info: {
                title: `${appConfig.appName}接口文档`,
                description: `${appConfig.appName}接口文档`,
                version: '1.0.0'
            },
            host: '127.0.0.1',
            schemes: ['http'],
            consumes: ['application/json'],
            produces: ['application/json']
        }
    });

    await fastify.register(fastifySwaggerUi, {
        routePrefix: '/swagger',
        initOAuth: {},
        uiConfig: {
            docExpansion: 'none',
            deepLinking: false
        },
        staticCSP: true
    });
}
export default fp(plugin, {
    name: 'swagger'
});
