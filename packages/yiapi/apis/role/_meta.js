import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = fnMeta(import.meta.url, {
    name: '角色',
    schema: {
        code: fnSchema(schemaField.code, '角色代号'),
        name: fnSchema(null, '角色名称', 'string', 1, 20),
        describe: fnSchema(schemaField.describe, '角色描述'),
        keyword: fnSchema(schemaField.keyword, '关键字'),
        menu_ids: {
            title: '菜单 ID 组',
            type: 'array',
            minItems: 0,
            maxItems: 10000,
            items: {
                type: 'number'
            }
        },
        api_ids: {
            title: '接口 ID 组',
            type: 'array',
            minItems: 0,
            maxItems: 10000,
            items: {
                type: 'number'
            }
        }
    }
});
