import path from 'node:path';
import { merge as mergeAny } from 'merge-anything';

import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'cache.js'));
let { cacheConfig: importConfig } = await fnImport(configPath, 'cacheConfig', {});

const cacheConfig = mergeAny(
    {
        cacheData_role: 'cacheData:role',
        cacheData_tree: 'cacheData:tree',
        cacheData_apiNames: 'cacheData:apiNames',
        cacheData_apiWhiteLists: 'cacheData:apiWhiteLists',
        cacheData_api: 'cacheData:api',
        cacheData_menu: 'cacheData:menu',
        cacheData_weixinAccessToken: 'cacheData:weixinAccessToken'
    },
    importConfig
);

export { cacheConfig };
