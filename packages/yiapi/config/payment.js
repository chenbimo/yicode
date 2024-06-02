import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { paymentConfig: importConfig } = await fnImportAppConfig('payment', []);

export const paymentConfig = importConfig;
