import { fnSchema } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';
import { fieldType } from '../../config/fieldType.js';

export const metaConfig = {
    name: '数据库表',
    schema: {
        id: fnSchema(schemaField.id, '唯一ID'),
        page: fnSchema(schemaField.page, '第几页'),
        limit: fnSchema(schemaField.limit, '每页多少条'),
        state: fnSchema(schemaField.state, '是否启用'),
        code: fnSchema(schemaField.table_code, '表编码'),
        name: fnSchema(schemaField.describe, '表描述'),
        describe: fnSchema(schemaField.describe, '表描述'),
        value: fnSchema(schemaField.string1to10000, '表字段'),
        fields: {
            title: '表字段',
            type: 'array',
            minItems: 1,
            items: {
                type: 'object',
                properties: {
                    comment: fnSchema(schemaField.string1to50, '字段名'),
                    code: fnSchema(schemaField.table_code, '字段编码'),
                    type: fnSchema(null, '字段类型', 'string', 1, 30, Object.keys(fieldType)),
                    length: fnSchema(schemaField.min0, '长度'),
                    index: fnSchema(schemaField.boolEnum, '索引'),
                    unsigned: fnSchema(schemaField.boolEnum, '无符号'),
                    unique: fnSchema(schemaField.boolEnum, '唯一值')
                },
                required: ['comment', 'code', 'type']
            }
        }
    }
};
