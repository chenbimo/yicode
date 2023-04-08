import path from 'path';
import { merge as mergeAny } from 'merge-anything';

import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'redis.js'));
let { redisConfig: importConfig } = await fnImport(configPath, 'redisConfig', {});

const redisConfig = mergeAny(
    {
        host: '127.0.0.1',
        port: 6379,
        username: null,
        password: null,
        keyPrefix: 'yiapi#'
    },
    importConfig
);

export { redisConfig };
