import dayjs from 'dayjs';
import fs from 'fs-extra';
import path from 'node:path';
import winston from 'winston';
import { merge as mergeAny } from 'merge-anything';
import 'winston-daily-rotate-file';

import { appConfig } from './app.js';
import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'logger.js'));
let { loggerConfig: importConfig } = await fnImport(configPath, 'loggerConfig', {});
fs.ensureDir(path.resolve(systemConfig.appDir, 'logs'));

let fileConfig = mergeAny(
    {
        dirname: path.resolve(systemConfig.appDir, 'logs'),
        filename: '%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '50m'
    },
    importConfig
);

let fileTransport = new winston.transports.DailyRotateFile(fileConfig);

let configParams = {
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

const loggerConfig = winston.createLogger(configParams);

export { loggerConfig };
