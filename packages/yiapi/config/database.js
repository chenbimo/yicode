import path from 'node:path';
import { merge as mergeAny } from 'merge-anything';
import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'database.js'));
let { databaseConfig: importConfig } = await fnImport(configPath, 'databaseConfig', {});

const databaseConfig = mergeAny(
    {
        db: null,
        username: null,
        password: null,
        host: null,
        dialect: 'mysql',
        port: 3306
    },
    importConfig
);

export { databaseConfig };
