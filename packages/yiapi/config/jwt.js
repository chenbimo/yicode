import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { jwt: importConfig } = await fnImportAppConfig('jwt', {});

export const jwtConfig = fnMerge({}, importConfig);
