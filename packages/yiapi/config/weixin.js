import path from 'node:path';
import { merge as mergeAny } from 'merge-anything';
import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'weixin.js'));
let { weixinConfig: importConfig } = await fnImport(configPath, 'weixinConfig', {});

const weixinConfig = mergeAny(
    {
        appId: '',
        appSecret: ''
    },
    importConfig
);
export { weixinConfig };
