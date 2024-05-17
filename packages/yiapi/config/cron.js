import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { cronConfig: importConfig } = await fnImportAppConfig('cron', {});

export const cronConfig = fnMerge({}, importConfig);
