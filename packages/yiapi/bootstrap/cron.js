import { Cron } from 'croner';
import fp from 'fastify-plugin';
import logSymbols from 'log-symbols';
import { yd_is_function } from '@yicode/yidash';

// 工具函数

// 配置信息
import { cronConfig } from '../config/cron.js';

function plugin(fastify, opts, next) {
    cronConfig.forEach((item) => {
        if (yd_is_function(item.handler) === false) {
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
