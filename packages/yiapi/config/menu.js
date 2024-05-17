import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { menuConfig: importConfig } = await fnImportAppConfig('menu', {});

export const menuConfig = fnMerge({}, importConfig);
