import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export const metaConfig = fnMeta(import.meta.url, {
    _name: '字典分类',
    code: fnSchema(null, '字典编码', 'string', 1, 20, '', null, '^[a-zA-Z][a-zA-Z0-9_-]*$'),
    name: fnSchema(null, '字典分类名称', 'string', 1, 20),
    describe: fnSchema(null, '字典分类描述', 'string', 0, 100)
});
