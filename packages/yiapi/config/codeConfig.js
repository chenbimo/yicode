// http状态码
export const codeConfig = {
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
    INFO: { symbol: 'INFO', code: 11, msg: '提示' },
    WARN: { symbol: 'WARN', code: 12, msg: '警告' },
    ERROR: { symbol: 'ERROR', code: 13, msg: '错误' },
    NOT_LOGIN: { symbol: 'NOT_LOGIN', code: 14, msg: '未登录' },
    API_DISABLED: { symbol: 'API_DISABLED', code: 15, msg: '接口已禁用' },
    NO_FILE: { symbol: 'NO_FILE', code: 17, msg: '文件不存在' },
    NO_API: { symbol: 'NO_API', code: 18, msg: '接口不存在' },
    NO_USER: { symbol: 'NO_USER', code: 19, msg: '用户不存在' },
    NO_DATA: { symbol: 'NO_DATA', code: 20, msg: '数据不存在' }
};
