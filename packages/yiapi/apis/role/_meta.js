import { fnSchema } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = {
    name: '角色',
    schema: {
        id: fnSchema(schemaField.id, '唯一ID'),
        page: fnSchema(schemaField.page, '第几页'),
        limit: fnSchema(schemaField.limit, '每页多少条'),
        state: fnSchema(schemaField.state, '是否启用'),
        code: fnSchema(schemaField.code, '角色代号'),
        name: fnSchema(null, '角色名称', 'string', 1, 20),
        describe: fnSchema(schemaField.describe, '角色描述'),
        keyword: fnSchema(schemaField.keyword, '关键字'),
        menu_ids: {
            title: '菜单ID组',
            type: 'array',
            minItems: 0,
            maxItems: 10000,
            items: {
                type: 'number'
            }
        },
        api_ids: {
            title: '接口ID组',
            type: 'array',
            minItems: 0,
            maxItems: 10000,
            items: {
                type: 'number'
            }
        }
    }
};
