import path from 'node:path';

import { merge as mergeAny } from 'merge-anything';
import { fnFileProtocolPath, fnImport } from '../utils/index.js';

import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'constant.js'));
let { constantConfig: importConfig } = await fnImport(configPath, 'constantConfig', {});

const constantConfig = mergeAny(
    {
        code: {
            SUCCESS: { symbol: 'SUCCESS', code: 0, msg: '操作成功' },
            INSERT_SUCCESS: { symbol: 'INSERT_SUCCESS', code: 0, msg: '添加成功' },
            SELECT_SUCCESS: { symbol: 'SELECT_SUCCESS', code: 0, msg: '查询成功' },
            UPDATE_SUCCESS: { symbol: 'UPDATE_SUCCESS', code: 0, msg: '更新成功' },
            DELETE_SUCCESS: { symbol: 'DELETE_SUCCESS', code: 0, msg: '删除成功' },
            FAIL: { symbol: 'FAIL', code: 1, msg: '操作失败' },
            INSERT_FAIL: { symbol: 'INSERT_FAIL', code: 1, msg: '添加失败' },
            SELECT_FAIL: { symbol: 'SELECT_FAIL', code: 1, msg: '查询失败' },
            UPDATE_FAIL: { symbol: 'UPDATE_FAIL', code: 1, msg: '更新失败' },
            DELETE_FAIL: { symbol: 'DELETE_FAIL', code: 1, msg: '删除失败' },
            INFO: { symbol: 'INFO', code: 11, msg: '信息提示' },
            WARN: { symbol: 'WARN', code: 12, msg: '警告提示' },
            ERROR: { symbol: 'ERROR', code: 13, msg: '错误提示' },
            NOT_LOGIN: { symbol: 'NOT_LOGIN', code: 14, msg: '请登录后操作' },
            API_DISABLED: { symbol: 'API_DISABLED', code: 15, msg: '接口已禁用' },
            NOT_EXISTS: { symbol: 'NOT_EXISTS', code: 16, msg: '接口不存在' },
            NO_FILE: { symbol: 'NO_FILE', code: 17, msg: '文件不存在' },
            API_NOT_FOUND: { symbol: 'API_NOT_FOUND', code: 18, msg: '接口不存在' }
        }
    },
    importConfig
);

export { constantConfig };
