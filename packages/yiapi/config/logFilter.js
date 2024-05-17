import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { logFilterConfig: importConfig } = await fnImportAppConfig('logFilter', []);

export const logFilterConfig = fnMerge([], importConfig);
