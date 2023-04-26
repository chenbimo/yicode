import path from 'node:path';
import { merge as mergeAny } from 'merge-anything';
import { forOwn as _forOwn, values as _values } from 'lodash-es';

import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'role.js'));
let { roleConfig: importConfig } = await fnImport(configPath, 'roleConfig', []);

// 角色初始化配置
const _roleConfig = mergeAny(
    {
        dev: {
            name: '游客',
            describe: '具备有限的权限和有限的查看内容',
            is_system: 1
        },
        user: {
            name: '用户',
            describe: '用户权限和对于的内容查看',
            is_system: 1
        },
        admin: {
            name: '管理',
            describe: '管理权限、除开发相关权限之外的权限等',
            is_system: 1
        },
        super: {
            name: '超级管理',
            describe: '超级管理权限、除开发相关权限之外的权限等',
            is_system: 1
        }
    },
    importConfig
);

let roleConfig = [];
_forOwn(_roleConfig, (item, key) => {
    item.code = key;
    roleConfig.push(item);
});

export { roleConfig };
