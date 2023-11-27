import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = fnMeta(import.meta.url, {
    name: '目录',
    schema: {
        pid: fnSchema(schemaField.pid, '父级目录 ID'),
        category: fnSchema(schemaField.category, '目录分类'),
        name: fnSchema(null, '目录名称', 'string', 1, 30),
        value: fnSchema(null, '目录值', 'string', 0, 300),
        icon: fnSchema(schemaField.image, '目录图标'),
        sort: fnSchema(schemaField.min0, '目录排序'),
        describe: fnSchema(schemaField.describe, '目录描述'),
        is_bool: fnSchema(schemaField.boolEnum, '是否虚拟目录'),
        is_open: fnSchema(schemaField.boolEnum, '是否公开')
    }
});
