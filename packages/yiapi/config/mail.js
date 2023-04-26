import path from 'node:path';
import { merge as mergeAny } from 'merge-anything';

import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'mail.js'));
let { mailConfig: importConfig } = await fnImport(configPath, 'mailConfig', {});

const mailConfig = mergeAny(
    {
        host: 'smtp.qq.com',
        port: 465,
        pool: true,
        secure: true,
        // qq邮箱
        user: 'demo@qq.com',
        pass: '',
        from: {
            name: '易接口',
            address: 'demo@qq.com'
        }
    },
    importConfig
);

export { mailConfig };
