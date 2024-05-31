import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { schemaFieldConfig: importConfig } = await fnImportAppConfig('schemaField', {});

export const schemaHelperConfig = Object.assign(importConfig, {
    // 主键 ID
    id: {
        name: '主键ID',
        type: 'bigInt',
        min: 1
    },
    // 第几页
    page: {
        name: '第几页',
        type: 'bigInt',
        default: 1,
        min: 1
    },
    // 每页数量
    limit: {
        name: '每页数量',
        type: 'bigInt',
        default: 20,
        min: 1,
        max: 100
    },
    // 搜索关键字
    keyword: {
        name: '搜索关键字',
        type: 'string',
        default: '',
        min: 0,
        max: 100
    },
    // 布尔值
    bool_enum: {
        name: '布尔值',
        type: 'tinyInt',
        enum: [0, 1]
    },
    // 状态 (0 正常，1 禁用，2 删除)
    state_enum: {
        name: '状态值',
        type: 'tinyInt',
        enum: [0, 1, 2]
    },
    // 最小数字为 1
    min1: {
        name: '最小数字为1',
        type: 'bigInt',
        min: 1
    },
    // 最小数字为 0
    min0: {
        name: '最小数字为0',
        type: 'bigInt',
        min: 0
    }
});
