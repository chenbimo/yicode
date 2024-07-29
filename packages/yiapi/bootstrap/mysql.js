import fp from 'fastify-plugin';
import Knex from 'knex';
import { yd_is_array } from '@yicode/yidash';

import { mysqlConfig } from '../config/mysql.js';
import { fnDbInsert } from '../utils/fnDbInsert.js';
import { fnDbUpdate } from '../utils/fnDbUpdate.js';

async function plugin(fastify, options) {
    try {
        // 添加数据
        Knex.QueryBuilder.extend('insertData', function (data) {
            if (yd_is_array(data)) {
                const data2 = data.map((item) => {
                    return fnDbInsert(item);
                });
                return this.insert(data2);
            } else {
                return this.insert(fnDbInsert(data));
            }
        });
        // 更新数据
        Knex.QueryBuilder.extend('updateData', function (data) {
            return this.update(fnDbUpdate(data));
        });
        // 删除数据
        Knex.QueryBuilder.extend('deleteData', function (data) {
            return this.delete(data);
        });
        // 查询数据
        Knex.QueryBuilder.extend('selectData', function (page, limit, args) {
            if (yd_is_array(args) === true) {
                return this.offset((page - 1) * limit)
                    .limit(limit)
                    .select(...args);
            } else {
                return this.offset((page - 1) * limit)
                    .limit(limit)
                    .select();
            }
        });
        // 查询一条
        Knex.QueryBuilder.extend('selectOne', function (args) {
            if (yd_is_array(args) === true) {
                return this.first(...args);
            } else {
                return this.first();
            }
        });
        // 查询所有
        Knex.QueryBuilder.extend('selectAll', function (args) {
            if (yd_is_array(args) === true) {
                return this.select(...args);
            } else {
                return this.select();
            }
        });
        // 查询总数
        Knex.QueryBuilder.extend('selectCount', function () {
            return this.count('id', { as: 'totalCount' }).first();
        });
        // 定义数据库链接
        const mysql = await new Knex({
            client: 'mysql2',
            connection: {
                host: mysqlConfig.host,
                port: mysqlConfig.port,
                user: mysqlConfig.username,
                password: mysqlConfig.password,
                database: mysqlConfig.db
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
        process.exit();
    }
}

export default fp(plugin, { name: 'mysql' });
