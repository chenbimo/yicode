import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerge.js';

const { logFilterConfig: importConfig } = await fnImportAppConfig('logFilter', []);

export const logFilterConfig = fnMerge([], importConfig);
