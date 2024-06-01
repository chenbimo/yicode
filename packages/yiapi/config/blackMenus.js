import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { toUnique } from '../utils/toUnique.js';

const { blackMenusConfig: importConfig } = await fnImportAppConfig('blackMenus', []);

export const blackMenusConfig = toUnique(importConfig);
