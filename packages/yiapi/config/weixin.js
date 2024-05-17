import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { weixin: importConfig } = await fnImportAppConfig('weixin', {});

export const weixinConfig = fnMerge({}, importConfig);
