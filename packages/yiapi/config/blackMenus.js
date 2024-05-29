import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { blackMenusConfig: importConfig } = await fnImportAppConfig('blackMenus', []);

export const blackMenusConfig = [...importConfig];
