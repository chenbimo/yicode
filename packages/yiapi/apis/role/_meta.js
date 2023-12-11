import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';
import { schemaRegexp } from '../../config/schemaRegexp.js';

export let metaConfig = fnMeta(import.meta.url, {
    name: '角色',
    schema: {
        code: fnSchema(null, '角色代号', 'string', 1, 20, '', null, schemaRegexp.aA0_),
        name: fnSchema(null, '角色名称', 'string', 0, 30),
        describe: fnSchema(null, '角色描述', 'string', 0, 100),
        keyword: fnSchema(schemaField.keyword, '关键字'),
        menu_ids: fnSchema(null, '菜单ID组', 'array', 0, 10000, [], null, 'integer', true),
        api_ids: fnSchema(null, '接口ID组', 'array', 0, 10000, [], null, 'integer', true)
    }
});
