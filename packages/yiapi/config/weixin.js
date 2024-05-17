import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { weixinConfig: importConfig } = await fnImportAppConfig('weixin', {});

export const weixinConfig = Object.assign({}, importConfig);
