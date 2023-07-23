import { Cron } from 'croner';
import fp from 'fastify-plugin';
import { isFunction } from 'lodash-es';
import logSymbols from 'log-symbols';

// 工具函数
import * as utils from '../utils/index.js';

// 配置信息
import { appConfig } from '../config/appConfig.js';
import { codeConfig } from '../config/codeConfig.js';
import { crosConfig } from '../config/crosConfig.js';
import { fieldType } from '../config/fieldType.js';
import { logConfig } from '../config/logConfig.js';
import { schemaField } from '../config/schemaField.js';
import { schemaType } from '../config/schemaType.js';
import { sysConfig } from '../config/sysConfig.js';
import { tableField } from '../config/tableField.js';

async function plugin(fastify, opts) {
    appConfig.cron.forEach((item) => {
        if (isFunction(item.handler) === false) {
            console.log(logSymbols.error, `${item.name} 定时器 handler 必须为一个函数`);
            process.exit();
        }
        const options = { name: item.name, maxRuns: item.maxRuns, timezone: item.timezone };
        const yiapi = {
            fastify,
            utils,
            appConfig,
            codeConfig,
            crosConfig,
            fieldType,
            schemaField,
            schemaType,
            sysConfig,
            tableField
        };
        const job = Cron(item.timer, options, () => {
            item.handler(yiapi);
        });
        fastify.decorate(item.code, job);
    });
}
export default fp(plugin, { name: 'cron', dependencies: ['tool'] });
