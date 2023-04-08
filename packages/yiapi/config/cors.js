import path from 'path';
import { merge as mergeAny } from 'merge-anything';
import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'cors.js'));
let { corsConfig: importConfig } = await fnImport(configPath, 'corsConfig', {});

const corsConfig = mergeAny(
    {
        methods: ['GET', 'OPTIONS', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'token'],
        exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization', 'authorization', 'token'],
        preflightContinue: false,
        strictPreflight: false,
        preflight: true,
        optionsSuccessStatus: 204,
        credentials: false
    },
    importConfig
);

export { corsConfig };
