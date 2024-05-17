import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { jwtConfig: importConfig } = await fnImportAppConfig('jwt', {});

export const jwtConfig = Object.assign({}, importConfig);
