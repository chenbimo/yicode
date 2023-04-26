import path from 'node:path';
import fs from 'fs-extra';
import fp from 'fastify-plugin';
import Knex from 'knex';
import fg from 'fast-glob';
import { databaseConfig } from '../config/database.js';

async function plugin(fastify, options) {
    try {
        // 定义数据库链接
        const mysql = await new Knex({
            client: 'mysql2',
            connection: {
                host: databaseConfig.host,
                port: databaseConfig.port,
                user: databaseConfig.username,
                password: databaseConfig.password,
                database: databaseConfig.db
            },
            acquireConnectionTimeout: 30000,
            asyncStackTraces: true,
            debug: false,
            pool: { min: 30, max: 1000 }
        });

        fastify.decorate('mysql', mysql);
    } catch (err) {
        fastify.log.error(err);
    }
}

export default fp(plugin, { name: 'mysql' });
