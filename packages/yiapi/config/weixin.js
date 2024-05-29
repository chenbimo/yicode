import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { weixinConfig: importConfig } = await fnImportAppConfig('weixin', {});

export const weixinConfig = Object.assign({}, importConfig);
