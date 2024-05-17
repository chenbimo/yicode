import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { callbackConfig: importConfig } = await fnImportAppConfig('callback', {});

export const callbackConfig = Object.assign({}, importConfig);
