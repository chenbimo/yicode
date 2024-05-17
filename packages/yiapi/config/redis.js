import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { redisConfig: importConfig } = await fnImportAppConfig('redis', {});

export const redisConfig = Object.assign({}, importConfig);
