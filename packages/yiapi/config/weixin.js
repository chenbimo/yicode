import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerge.js';

const { weixinConfig: importConfig } = await fnImportAppConfig('weixin', {});

export const weixinConfig = Object.assign({}, importConfig);
