import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { blackApisConfig: importConfig } = await fnImportAppConfig('blackApis', []);

export const blackApisConfig = [...importConfig];
