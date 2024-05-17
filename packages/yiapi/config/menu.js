import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { menuConfig: importConfig } = await fnImportAppConfig('menu', {});

export const menuConfig = Object.assign({}, importConfig);
