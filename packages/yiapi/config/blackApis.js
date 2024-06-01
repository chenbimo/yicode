import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { toUnique } from '../utils/toUnique.js';

const { blackApisConfig: importConfig } = await fnImportAppConfig('blackApis', []);

export const blackApisConfig = toUnique(importConfig);
