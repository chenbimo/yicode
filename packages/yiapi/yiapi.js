import path from 'path';
import fs from 'fs-extra';
import Fastify from 'fastify';
import autoLoad from '@fastify/autoload';
import fp from 'fastify-plugin';
import localize from 'ajv-i18n';
import { forOwn as _forOwn } from 'lodash-es';
import fg from 'fast-glob';
import fastifyStatic from '@fastify/static';

// 工具函数
import * as utils from './utils/index.js';

// 配置信息
import { appConfig } from './config/app.js';
import { loggerConfig } from './config/logger.js';
import { constantConfig } from './config/constant.js';
import { schemaConfig } from './config/schema.js';
import { menuConfig } from './config/menu.js';
import { roleConfig } from './config/role.js';
import { databaseConfig } from './config/database.js';
import { systemConfig } from './system.js';

// 表同步
import { syncDatabase } from './scripts/syncDatabase.js';

// 表定义
import sysAdminTable from './tables/admin.js';
import sysArticleTable from './tables/article.js';
import sysBannerTable from './tables/banner.js';
import sysDictionaryTable from './tables/dictionary.js';
import sysFeedbackTable from './tables/feedback.js';
import sysNoticeTable from './tables/notice.js';
import sysRoleTable from './tables/role.js';
import sysTreeTable from './tables/tree.js';
import sysUserTable from './tables/user.js';

// 初始化项目结构
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'addons'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'apis'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'config'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'config', 'custom'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'logs'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'plugins'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'public'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'scripts'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'tables'));
fs.ensureDirSync(path.resolve(systemConfig.appDir, 'utils'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'yiapi.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'app.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'constant.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'cors.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'database.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'dictionary.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'jwt.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'logger.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'mail.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'mapTable.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'menu.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'redis.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'role.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'schema.js'));
fs.ensureFileSync(path.resolve(systemConfig.appDir, 'config', 'weixin.js'));

// 初始化项目实例
const fastify = Fastify({
    logger: loggerConfig,
    pluginTimeout: 0,
    genReqId: () => utils.fnUUID(),
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
        let msg = err.validation
            .map((error) => {
                return (error.parentSchema.title + ' ' + error.message).trim();
            })
            .join(',');
        res.status(200).send({ code: 1, msg: msg, symbol: 'GLOBAL_ERROR' });
        return;
    }

    if (err.statusCode >= 500) {
        fastify.log.error(err);
        // 发送错误响应
    } else if (err.statusCode >= 400) {
        fastify.log.warn(err);
    } else {
        fastify.log.warn(err);
    }

    // 发送错误响应
    res.status(200).send({ code: 1, msg: err.message, symbol: 'GLOBAL_ERROR' });
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
    root: path.resolve(systemConfig.appDir, 'public'),
    prefix: '/'
});

fastify.get('/', function (req, res) {
    res.send({
        code: 0,
        msg: `${appConfig.appName} 接口程序已启动`
    });
});

// 路由映射列表
// fastify.register(autoLoad, {
//     dir: path.join(systemConfig.yiapiDir, 'plugins'),
//     matchFilter: (path) => {
//         return path === '/routes.js';
//     }
// });

// 接口文档生成
fastify.register(autoLoad, {
    dir: path.join(systemConfig.yiapiDir, 'plugins'),
    matchFilter: (path) => {
        return path === '/swagger.js';
    }
});

// 加载启动插件
fastify.register(autoLoad, {
    dir: path.join(systemConfig.yiapiDir, 'bootstrap'),
    matchFilter: (path) => {
        return path.endsWith('.js') === true;
    },
    ignorePattern: /^[_.]/
});

// 加载系统接口
fastify.register(autoLoad, {
    dir: path.join(systemConfig.yiapiDir, 'apis'),
    matchFilter: (path) => {
        return path.endsWith('.js') === true;
    },
    ignorePattern: /^[_.]/,
    options: {
        prefix: '/api'
    }
});

// 加载用户接口
fastify.register(autoLoad, {
    dir: path.join(systemConfig.appDir, 'apis'),
    matchFilter: (path) => {
        return path.endsWith('.js') === true;
    },
    ignorePattern: /^[_.]/,
    options: {
        prefix: '/api'
    }
});

// 加载三方接口
let thirdApiFiles = fg.sync(['./addons/*/apis/*', '!**/_*.js'], { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });
let prefixEnum = {};
for (let i = 0; i < thirdApiFiles.length; i++) {
    let file = thirdApiFiles[i];
    // let prefix = path.basename(path.dirname(path.dirname(file)));

    let prefix = path
        .dirname(file)
        .replace(/\\+/gi, '/')
        .replace(/.+\/addons/, '')
        .replace('/apis', '');

    prefixEnum[prefix] = path.dirname(file);
}

_forOwn(prefixEnum, (apis, prefix) => {
    fastify.register(autoLoad, {
        dir: apis,
        options: {
            prefix: prefix
        },
        matchFilter: (path) => {
            return path.endsWith('.js') === true;
        },
        ignorePattern: /^[_.]/
    });
});

// 加载用户插件
fastify.register(autoLoad, {
    dir: path.join(systemConfig.appDir, 'plugins'),
    matchFilter: (path) => {
        return path.endsWith('.js') === true;
    },
    ignorePattern: /^[_.]/
});

// 加载三方插件
let thirdPluginsFiles = fg.sync(['./addons/*/plugins/*', '!**/_*.js'], { onlyFiles: true, dot: false, absolute: true, cwd: systemConfig.appDir });

thirdPluginsFiles.forEach((file) => {
    fastify.register(autoLoad, {
        dir: path.dirname(file),
        matchFilter: (path) => {
            return path.endsWith('.js') === true;
        },
        ignorePattern: /^[_.]/
    });
});

function initServer() {
    return new Promise(async (resolve, reject) => {
        // 启动服务！
        fastify.listen({ port: appConfig.port, host: '127.0.0.1' }, async function (err, address) {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            await fastify.cacheTreeData();
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
    });
}

export {
    // 内部工具
    fastify,
    initServer,
    utils,
    fp,
    // 配置数据
    constantConfig,
    schemaConfig,
    systemConfig,
    appConfig,
    menuConfig,
    roleConfig,
    databaseConfig,
    syncDatabase,
    // 字段数据
    sysAdminTable,
    sysArticleTable,
    sysBannerTable,
    sysDictionaryTable,
    sysFeedbackTable,
    sysNoticeTable,
    sysRoleTable,
    sysTreeTable,
    sysUserTable
};
