import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { mail: importConfig } = await fnImportAppConfig('mail', {});

export const mailConfig = fnMerge({}, importConfig);
