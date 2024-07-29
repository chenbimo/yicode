import { yd_data_unique } from '@yicode/yidash';
import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { freeApisConfig: importConfig } = await fnImportAppConfig('freeApis', []);

export const freeApisConfig = yd_data_unique([
    //
    '/',
    '/favicon.*',
    '/public/**',
    ...importConfig
]);
