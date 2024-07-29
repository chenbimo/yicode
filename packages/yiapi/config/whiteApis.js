import { yd_data_unique } from '@yicode/yidash';
import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { whiteApisConfig: importConfig } = await fnImportAppConfig('whiteApis', []);

export const whiteApisConfig = yd_data_unique(importConfig);
