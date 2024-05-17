import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { rateConfig: importConfig } = await fnImportAppConfig('rate', {});

export const rateConfig = Object.assign({}, importConfig);
