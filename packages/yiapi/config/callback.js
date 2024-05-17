import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { callback: importConfig } = await fnImportAppConfig('callback', {});

export const callbackConfig = fnMerge({}, importConfig);
