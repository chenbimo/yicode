import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerge.js';

const { whiteApisConfig: importConfig } = await fnImportAppConfig('whiteApis', []);

export const whiteApisConfig = fnMerge([], importConfig);
