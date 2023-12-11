import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';
import { schemaRegexp } from '../../config/schemaRegexp.js';

export const metaConfig = fnMeta(import.meta.url, {
    _name: '字典',
    code: fnSchema(null, '字典编码', 'string', 1, 20, '', null, schemaRegexp.aA0_d),
    category_id: fnSchema(schemaField.min1, '字典分类 ID'),
    category_code: fnSchema(null, '字典分类', 'string', 1, 20, '', null, schemaRegexp.aA0_d),
    name: fnSchema(null, '字典名称', 'string', 1, 20),
    value: fnSchema(null, '字典值', 'string', 0, 500, ''),
    symbol: fnSchema(null, '字典符号', 'string', null, null, null, ['string', 'number']),
    thumbnail: fnSchema(schemaField.image, '字典缩略图'),
    describe: fnSchema(null, '字典描述', 'string', 0, 100)
});
