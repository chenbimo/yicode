// 核心模块
import { resolve } from 'node:path';
// 外部模块
import winston from 'winston';
import 'winston-daily-rotate-file';

import { system } from '../system.js';

const fileConfig = {
    dirname: resolve(system.appDir, 'logs'),
    filename: '%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '50m'
};

const fileTransport = new winston.transports.DailyRotateFile(fileConfig);

const configParams = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        trace: 4,
        debug: 5
    },
    level: 'warn',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: []
};

// 如果是产品环境，则将日志写到文件中
// 如果是开发环境，则直接打印日志
if (process.env.NODE_ENV === 'production') {
    configParams.transports = [fileTransport];
} else {
    configParams.transports = [new winston.transports.Console()];
}

const logger = winston.createLogger(configParams);

export { logger };
