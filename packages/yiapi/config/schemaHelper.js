import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { schemaFieldConfig: importConfig } = await fnImportAppConfig('schemaField', {});

export const schemaHelperConfig = Object.assign(importConfig, {
    // 主键 ID
    id: {
        name: '主键ID',
        field: {
            type: 'bigInt'
        },
        schema: {
            type: 'integer',
            min: 1
        }
    },
    // 主键 ID
    pid: {
        name: '父级ID',
        field: {
            type: 'bigInt'
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    // 第几页
    page: {
        name: '第几页',
        field: {
            type: 'bigInt'
        },
        schema: {
            type: 'integer',
            default: 1,
            min: 1
        }
    },
    // 每页数量
    limit: {
        name: '每页数量',
        field: {
            type: 'bigInt'
        },
        schema: {
            type: 'integer',
            default: 20,
            min: 1,
            max: 100
        }
    },
    // 布尔值
    boolEnum: {
        name: '布尔值',
        field: {
            type: 'tinyInt'
        },
        schema: {
            type: 'integer',
            enum: [0, 1]
        }
    },
    // 状态 (0 正常，1 禁用，2 删除)
    stateEnum: {
        name: '状态值',
        field: {
            type: 'tinyInt'
        },
        schema: {
            type: 'integer',
            enum: [0, 1, 2]
        }
    },
    // 最小数字为 1
    min1: {
        name: '最小数字为1',
        field: {
            type: 'bigInt'
        },
        schema: {
            type: 'integer',
            min: 1
        }
    },
    // 最小数字为 0
    min0: {
        name: '最小数字为0',
        field: {
            type: 'bigInt'
        },
        schema: {
            type: 'integer',
            min: 0
        }
    }
});
