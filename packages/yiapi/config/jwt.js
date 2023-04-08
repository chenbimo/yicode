import path from 'path';
import { merge as mergeAny } from 'merge-anything';
import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'jwt.js'));
let { jwtConfig: importConfig } = await fnImport(configPath, 'jwtConfig', {});

const jwtConfig = mergeAny(
    {
        secret: 'yiapi',
        expiresIn: '7d',
        algorithm: 'HS256'
    },
    importConfig
);
export { jwtConfig };
