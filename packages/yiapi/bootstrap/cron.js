import { Cron } from 'croner';
import fp from 'fastify-plugin';
import { isFunction } from 'lodash-es';
import logSymbols from 'log-symbols';

// 工具函数
import * as utils from '../utils/index.js';

// 配置信息
import { appConfig } from '../config/appConfig.js';

async function plugin(fastify, opts) {
    appConfig.cron.forEach((item) => {
        if (isFunction(item.handler) === false) {
            console.log(logSymbols.error, `${item.name} 定时器 handler 必须为一个函数`);
            process.exit();
        }
        const options = {
            name: item.name,
            maxRuns: item.maxRuns,
            timezone: item.timezone
        };
        const job = Cron(item.timer, options, () => {
            item.handler(appConfig);
        });
        fastify.decorate(item.code, job);
    });
}
export default fp(plugin, { name: 'cron', dependencies: ['tool'] });
