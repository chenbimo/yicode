import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { tableExt: importConfig } = await fnImportAppConfig('tableExt', {});

export const tableExtConfig = fnMerge({}, importConfig);
