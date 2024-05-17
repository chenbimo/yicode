import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { mailConfig: importConfig } = await fnImportAppConfig('mail', {});

export const mailConfig = Object.assign(
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
