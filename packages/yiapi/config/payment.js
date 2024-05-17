import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { payment: importConfig } = await fnImportAppConfig('payment', {});

export const paymentConfig = fnMerge({}, importConfig);
