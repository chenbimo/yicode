import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { schemaFieldConfig: importConfig } = await fnImportAppConfig('schemaField', {});

export const schemaHelperConfig = Object.assign(importConfig, {
    // 主键 ID
    id: {
        name: '主键ID',
        schemaType: 'integer',
        minimum: 1
    },
    // 主键 ID
    pid: {
        name: '父级ID',
        schemaType: 'integer',
        minimum: 0
    },
    // 第几页
    page: {
        name: '第几页',
        schemaDefault: 1,
        schemaType: 'integer',
        minimum: 1
    },
    // 每页数量
    limit: {
        name: '每页数量',
        schemaDefault: 20,
        schemaType: 'integer',
        minimum: 1,
        maximum: 100
    },
    // 布尔值
    boolEnum: {
        name: '布尔值',
        schemaType: 'integer',
        enum: [0, 1]
    },
    // 状态 (0 正常，1 禁用，2 删除)
    stateEnum: {
        name: '状态值',
        schemaType: 'integer',
        enum: [0, 1, 2]
    },
    // 最小数字为 1
    min1: {
        name: '最小数字为1',
        schemaType: 'integer',
        minimum: 1
    },
    // 最小数字为 0
    min0: {
        name: '最小数字为0',
        schemaType: 'integer',
        minimum: 0
    }
});
