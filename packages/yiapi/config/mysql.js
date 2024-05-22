import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { mysqlConfig: importConfig } = await fnImportAppConfig('mysql', {});

export const mysqlConfig = Object.assign(
    {
        host: '127.0.0.1',
        port: 3306,
        db: 'test3',
        username: 'root',
        password: 'root'
    },
    importConfig
);
