import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { freeApisConfig: importConfig } = await fnImportAppConfig('freeApis', []);

export const freeApisConfig = [
    //
    '/',
    '/favicon.*',
    '/public/**',
    ...importConfig
];
