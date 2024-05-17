import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { uploadConfig: importConfig } = await fnImportAppConfig('upload', {});

export const uploadConfig = Object.assign({}, importConfig);
