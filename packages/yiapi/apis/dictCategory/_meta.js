import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = fnMeta(import.meta.url, {
    name: '字典分类',
    schema: {
        code: fnSchema(schemaField.Aa123_d, '字典编码'),
        name: fnSchema(null, '字典分类名称', 'string', 1, 20),
        describe: fnSchema(null, '字典分类描述', 'string', 0, 300)
    }
});
