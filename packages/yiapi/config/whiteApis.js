import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { whiteApisConfig: importConfig } = await fnImportAppConfig('whiteApis', []);

export const whiteApisConfig = [...importConfig];
