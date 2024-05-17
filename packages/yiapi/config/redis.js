import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { redis: importConfig } = await fnImportAppConfig('redis', {});

export const redisConfig = fnMerge({}, importConfig);
