import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { mailConfig: importConfig } = await fnImportAppConfig('mail', {});

export const mailConfig = fnMerge(
    {
        host: 'demo.com',
        port: 465,
        pool: true,
        secure: true,
        // qq 邮箱
        user: 'demo@qq.com',
        pass: '',
        from_name: '易接口',
        from_email: 'demo@qq.com'
    },
    importConfig
);
