import { Cron } from 'croner';
import fp from 'fastify-plugin';
import logSymbols from 'log-symbols';

// 工具函数

// 配置信息
import { cronConfig } from '../config/cron.js';
import { isFunction } from '../utils/isFunction.js';

function plugin(fastify, opts, next) {
    cronConfig.forEach((item) => {
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
    next();
}
export default fp(plugin, { name: 'cron', dependencies: ['tool'] });
