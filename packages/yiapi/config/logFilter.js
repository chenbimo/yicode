import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { logFilterConfig: importConfig } = await fnImportAppConfig('logFilter', []);

export const logFilterConfig = [...importConfig];
