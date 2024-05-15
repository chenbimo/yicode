import fp from 'fastify-plugin';
import Knex from 'knex';

import { appConfig } from '../config/appConfig.js';
import { fnDbInsertData, fnDbUpdateData } from '../utils/index.js';

async function plugin(fastify, options) {
    try {
        // 添加数据
        Knex.QueryBuilder.extend('insertData', function (data) {
            if (Array.isArray(data)) {
                const data2 = data.map((item) => {
                    return fnDbInsertData(item);
                });
                return this.insert(data2);
            } else {
                return this.insert(fnDbInsertData(data));
            }
        });
        // 更新数据
        Knex.QueryBuilder.extend('updateData', function (data) {
            return this.update(fnDbUpdateData(data));
        });
        // 删除数据
        Knex.QueryBuilder.extend('deleteData', function (data) {
            return this.delete(data);
        });
        // 查询数据
        Knex.QueryBuilder.extend('selectData', function (page, limit, ...args) {
            return this.offset((page - 1) * limit)
                .limit(limit)
                .select(args);
        });
        // 查询一条
        Knex.QueryBuilder.extend('selectOne', function (...args) {
            return this.first(args);
        });
        // 查询所有
        Knex.QueryBuilder.extend('selectAll', function (...args) {
            return this.select(args);
        });
        // 查询总数
        Knex.QueryBuilder.extend('selectCount', function (...args) {
            return this.count('id', { as: 'totalCount' }).first();
        });
        // 定义数据库链接
        const mysql = await new Knex({
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
        process.exit(1);
    }
}

export default fp(plugin, { name: 'mysql' });
