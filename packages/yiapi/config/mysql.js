import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { mysql: importConfig } = await fnImportAppConfig('mysql', {});

export const mysqlConfig = fnMerge({}, importConfig);
