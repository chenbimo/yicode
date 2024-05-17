import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { freeApisConfig: importConfig } = await fnImportAppConfig('freeApis', []);

export const freeApisConfig = fnMerge([], importConfig);
