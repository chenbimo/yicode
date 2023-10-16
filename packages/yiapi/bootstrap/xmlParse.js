import fp from 'fastify-plugin';
import fastifyXmlBodyParser from 'fastify-xml-body-parser';
import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, options) {
    await fastify.register(fastifyXmlBodyParser, {});
}

export default fp(plugin, {
    name: 'xmlParse'
});
