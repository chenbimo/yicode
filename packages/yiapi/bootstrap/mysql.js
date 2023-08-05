import fp from 'fastify-plugin';
import Knex from 'knex';

import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, options) {
    try {
        // 定义数据库链接
        let mysql = await new Knex({
            client: 'mysql2',
            connection: {
                host: appConfig.database.host,
                port: appConfig.database.port,
                user: appConfig.database.username,
                password: appConfig.database.password,
                database: appConfig.database.db
            },
            acquireConnectionTimeout: 30000,
            asyncStackTraces: true,
            debug: false,
            pool: {
                min: 30,
                max: 1000
            }
        });

        fastify.decorate('mysql', mysql).addHook('onClose', (instance, done) => {
            if (instance.knex === handler) {
                instance.knex.destroy();
            }

            done();
        });
    } catch (err) {
        fastify.log.error(err);
    }
}

export default fp(plugin, { name: 'mysql' });
