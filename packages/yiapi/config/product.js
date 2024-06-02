import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { productConfig: importConfig } = await fnImportAppConfig('product', {});

export const productConfig = importConfig;
