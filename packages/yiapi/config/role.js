import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { roleConfig: importConfig } = await fnImportAppConfig('role', {});

export const roleConfig = Object.assign(importConfig, {
    visitor: {
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
});
