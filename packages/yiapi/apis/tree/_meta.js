import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = fnMeta(import.meta.url, {
    _name: '树',
    pid: fnSchema(schemaField.pid, '父级目录 ID'),
    category: fnSchema(null, '目录分类', 'string', 1, 20, '', null, schemaRegexp.aA0_),
    name: fnSchema(null, '目录名称', 'string', 1, 30),
    value: fnSchema(null, '目录值', 'string', 0, 300),
    icon: fnSchema(schemaField.image, '目录图标'),
    sort: fnSchema(schemaField.min0, '目录排序'),
    describe: fnSchema(null, '目录描述', 'string', 0, 100),
    is_bool: fnSchema(schemaField.boolEnum, '是否虚拟目录'),
    is_open: fnSchema(schemaField.boolEnum, '是否公开')
});
