import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { cronConfig: importConfig } = await fnImportAppConfig('cron', []);

export const cronConfig = Object.assign([], importConfig);
