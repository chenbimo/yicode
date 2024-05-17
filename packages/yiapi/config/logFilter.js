import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { logFilter: importConfig } = await fnImportAppConfig('logFilter', {});

export const logFilterConfig = fnMerge({}, importConfig);
