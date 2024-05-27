// 先进行全面检测
import './check.js';
// 核心模块
import { resolve, join } from 'node:path';
// 外部模块
import Fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import fp from 'fastify-plugin';
import localize from 'ajv-i18n';
import logSymbols from 'log-symbols';
import fastifyStatic from '@fastify/static';
import gracefulShutdown from 'http-graceful-shutdown';
// 启动插件
import swaggerPlugin from './plugins/swagger.js';
import { logger } from './plugins/logger.js';
import jwtPlugin from './plugins/jwt.js';
import xmlParsePlugin from './bootstrap/xmlParse.js';
import redisPlugin from './bootstrap/redis.js';
import mysqlPlugin from './bootstrap/mysql.js';
import toolPlugin from './bootstrap/tool.js';
import corsPlugin from './bootstrap/cors.js';
import cronPlugin from './bootstrap/cron.js';
import authPlugin from './bootstrap/auth.js';
import mailPlugin from './bootstrap/mail.js';
import ratePlugin from './bootstrap/rate.js';
import syncApiPlugin from './bootstrap/syncApi.js';
import syncMenuPlugin from './bootstrap/syncMenu.js';
import syncDevPlugin from './bootstrap/syncDev.js';
import uploadPlugin from './bootstrap/upload.js';

// 配置信息
import { appConfig } from './config/app.js';
import { system } from './system.js';

const appDir = system.appDir;
const yiapiDir = system.yiapiDir;

// 初始化项目实例
const fastify = Fastify({
    logger: logger,
    pluginTimeout: 0,
    bodyLimit: 10485760, // 10M
    ajv: {
        customOptions: {
            allErrors: true,
            verbose: true
        }
    }
});

// 处理全局错误
fastify.setErrorHandler(function (err, req, res) {
    if (err.validation) {
        localize.zh(err.validation);
        const msg = err.validation
            .map((error) => {
                return (error.parentSchema.title + ' ' + error.message).trim();
            })
            .join(',');
        res.status(200).send({
            code: 1,
            msg: msg,
            symbol: 'GLOBAL_ERROR'
        });
        return;
    }

    if (err.statusCode >= 500) {
        fastify.log.error(err);
        // 发送错误响应
    } else if (err.statusCode === 429) {
        err.message = '请求过快，请降低请求频率。';
    } else if (err.statusCode >= 400) {
        fastify.log.warn(err);
    } else {
        fastify.log.warn(err);
    }

    // 发送错误响应
    res.status(200).send({
        code: 1,
        msg: err.message,
        symbol: 'GLOBAL_ERROR'
    });
});

// 处理未找到路由
fastify.setNotFoundHandler(function (req, res) {
    // 发送错误响应
    res.status(200).send({
        code: 1,
        msg: '未知路由',
        data: req.url
    });
});

// 静态资源托管
fastify.register(fastifyStatic, {
    root: resolve(system.appDir, 'public'),
    prefix: '/'
});

// 根请求
fastify.get('/', function (req, res) {
    res.send({
        code: 0,
        msg: `${appConfig.appName} 接口程序已启动`
    });
});

// 加载启动插件
if (appConfig.isSwagger === true) {
    fastify.register(swaggerPlugin, {});
}
fastify.register(jwtPlugin, {});
fastify.register(xmlParsePlugin, {});
fastify.register(redisPlugin, {});
fastify.register(mysqlPlugin, {});
fastify.register(toolPlugin, {});
fastify.register(corsPlugin, {});
fastify.register(cronPlugin, {});
fastify.register(authPlugin, {});
fastify.register(mailPlugin, {});
fastify.register(ratePlugin, {});
fastify.register(uploadPlugin, {});
fastify.register(syncMenuPlugin, {});
fastify.register(syncApiPlugin, {});
// fastify.register(syncDevPlugin, {});

// 加载用户插件
// fastify.register(autoLoad, {
//     dir: join(system.appDir, 'plugins'),
//     matchFilter: (_path) => {
//         return _path.endsWith('.js') === true;
//     },
//     ignorePattern: /^[_.]/
// });

// 加载系统接口
// fastify.register(autoLoad, {
//     dir: join(system.yiapiDir, 'apis'),
//     matchFilter: (_path) => {
//         return _path.endsWith('.js') === true;
//     },
//     ignorePattern: /^[_.]/,
//     options: {
//         prefix: '/api'
//     }
// });

// 加载用户接口
// fastify.register(autoLoad, {
//     dir: join(system.appDir, 'apis'),
//     matchFilter: (_path) => {
//         return _path.endsWith('.js') === true;
//     },
//     ignorePattern: /^[_.]/,
//     options: {
//         prefix: '/api'
//     }
// });

// 初始化服务
function initServer() {
    return new Promise(async (resolve, reject) => {
        // 启动服务！
        fastify.listen({ port: appConfig.port, host: appConfig.host }, async function (err, address) {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            fastify.log.warn(`${appConfig.appName} 接口服务已启动： ${address}`);
            console.log(`${appConfig.appName} 接口服务已启动： ${address}`);
        });

        fastify.ready((err) => {
            if (err) {
                throw err;
            } else {
                return resolve(fastify);
            }
        });

        // 监听服务停止
        gracefulShutdown(fastify.server, {
            finally: function () {
                fastify.log.warn('服务已停止');
            }
        });
    });
}

export {
    //
    fastify,
    fp,
    initServer,
    appDir,
    yiapiDir
};
