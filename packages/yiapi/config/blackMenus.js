import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerge.js';

const { blackMenusConfig: importConfig } = await fnImportAppConfig('blackMenus', []);

export const blackMenusConfig = fnMerge([], importConfig);
