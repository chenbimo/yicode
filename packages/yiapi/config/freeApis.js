import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { toUnique } from '../utils/toUnique.js';

const { freeApisConfig: importConfig } = await fnImportAppConfig('freeApis', []);

export const freeApisConfig = toUnique([
    //
    '/',
    '/favicon.*',
    '/public/**',
    ...importConfig
]);
