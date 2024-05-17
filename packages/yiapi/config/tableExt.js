import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { tableExtConfig: importConfig } = await fnImportAppConfig('tableExt', {});

export const tableExtConfig = Object.assign({}, importConfig);
