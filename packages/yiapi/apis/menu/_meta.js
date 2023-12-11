import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = fnMeta(import.meta.url, {
    _name: '菜单',
    pid: fnSchema(schemaField.pid, '父级目录 ID'),
    name: fnSchema(null, '目录名称', 'string', 1, 30),
    value: fnSchema(schemaField.route, '菜单路由'),
    icon: fnSchema(schemaField.image, '目录图标'),
    sort: fnSchema(schemaField.min0, '目录排序'),
    state: fnSchema(schemaField.stateEnum, '目录状态'),
    describe: fnSchema(null, '目录描述', 'string', 0, 100),
    is_open: fnSchema(schemaField.boolEnum, '是否公开')
});
