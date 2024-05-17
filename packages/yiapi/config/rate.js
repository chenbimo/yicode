import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { rate: importConfig } = await fnImportAppConfig('rate', {});

export const rateConfig = fnMerge({}, importConfig);
