import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { blackApisConfig: importConfig } = await fnImportAppConfig('blackApis', []);

export const blackApisConfig = fnMerge([], importConfig);
