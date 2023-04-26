import path from 'node:path';
import { merge as mergeAny } from 'merge-anything';
import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'mapTable.js'));
let { mapTableConfig: importConfig } = await fnImport(configPath, 'mapTableConfig', {});

const mapTableConfig = mergeAny(
    {
        sys_admin: 'sys_admin',
        sys_article: 'sys_article',
        sys_banner: 'sys_banner',
        sys_dictionary: 'sys_dictionary',
        sys_feedback: 'sys_feedback',
        sys_notice: 'sys_notice',
        sys_role: 'sys_role',
        sys_tree: 'sys_tree',
        sys_user: 'sys_user',
        sys_menu: 'sys_menu',
        sys_api: 'sys_api'
    },
    importConfig
);

export { mapTableConfig };
