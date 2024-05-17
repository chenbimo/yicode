import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { mysqlConfig: importConfig } = await fnImportAppConfig('mysql', {});

export const mysqlConfig = fnMerge(
    {
        host: '127.0.0.1',
        port: 3306,
        db: 'test',
        username: 'root',
        password: 'root'
    },
    importConfig
);
