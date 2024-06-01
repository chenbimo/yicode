import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { toUnique } from '../utils/toUnique.js';

const { whiteApisConfig: importConfig } = await fnImportAppConfig('whiteApis', []);

export const whiteApisConfig = toUnique(importConfig);
