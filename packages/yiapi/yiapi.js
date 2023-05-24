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
import { appConfig } from './config/appConfig.js';
import { codeConfig } from './config/codeConfig.js';
import { crosConfig } from './config/crosConfig.js';
import { fieldType } from './config/fieldType.js';
import { schemaField } from './config/schemaField.js';
import { schemaType } from './config/schemaType.js';
import { sysConfig } from './config/sysConfig.js';
import { tableField } from './config/tableField.js';

// 表同步
import { syncDatabase } from './scripts/syncDatabase.js';

// 表定义
import sysAdminTable from './tables/admin.js';
import sysDictTable from './tables/dict.js';
import sysRoleTable from './tables/role.js';
import sysTreeTable from './tables/tree.js';
import sysUserTable from './tables/user.js';
import sysMenuTable from './tables/menu.js';
import sysApiTable from './tables/api.js';

// 初始化项目结构
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'addons'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'apis'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'config'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'logs'));
fs.ensureDirSync(path.resolve(sysConfig.appDir, 'public'));
fs.ensureFileSync(path.resolve(sysConfig.appDir, 'yiapi.js'));

// 初始化项目实例
const fastify = Fastify({
    logger: logConfig,
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
    root: path.resolve(sysConfig.appDir, 'public'),
    prefix: '/'
});

// 根请求
fastify.get('/', function (req, res) {
    res.send({
        code: 0,
        msg: `${appConfig.appName} 接口程序已启动`
    });
});

// 路由映射列表
// fastify.register(autoLoad, {
//     dir: path.join(sysConfig.yiapiDir, 'plugins'),
//     matchFilter: (path) => {
//         return path === '/routes.js';
//     }
// });

// 接口文档生成
fastify.register(autoLoad, {
    dir: path.join(sysConfig.yiapiDir, 'plugins'),
    matchFilter: (path) => {
        return path === '/swagger.js';
    }
});

// 加载启动插件
fastify.register(autoLoad, {
    dir: path.join(sysConfig.yiapiDir, 'bootstrap'),
    matchFilter: (path) => {
        return path.endsWith('.js') === true;
    },
    ignorePattern: /^[_.]/
});

// 加载系统接口
fastify.register(autoLoad, {
    dir: path.join(sysConfig.yiapiDir, 'apis'),
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
    dir: path.join(sysConfig.appDir, 'apis'),
    matchFilter: (path) => {
        return path.endsWith('.js') === true;
    },
    ignorePattern: /^[_.]/,
    options: {
        prefix: '/api'
    }
});

// 加载三方接口
let thirdApiFiles = fg.sync(['./addons/*/apis/*', '!**/_*.js'], { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.appDir });
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
// fastify.register(autoLoad, {
//     dir: path.join(sysConfig.appDir, 'plugins'),
//     matchFilter: (path) => {
//         return path.endsWith('.js') === true;
//     },
//     ignorePattern: /^[_.]/
// });

// 加载三方插件
let thirdPluginsFiles = fg.sync(['./addons/*/plugins/*', '!**/_*.js'], { onlyFiles: true, dot: false, absolute: true, cwd: sysConfig.appDir });

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
    // 配置
    appConfig,
    codeConfig,
    crosConfig,
    fieldType,
    schemaField,
    schemaType,
    sysConfig,
    tableField,
    // 插件
    syncDatabase
};
