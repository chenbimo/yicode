import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export const metaConfig = fnMeta(import.meta.url, {
    name: '字典',
    schema: {
        code: fnSchema(schemaField.Aa123_d, '字典编码'),
        category_id: fnSchema(schemaField.min1, '字典分类 ID'),
        category_code: fnSchema(schemaField.Aa123_d, '字典分类'),
        name: fnSchema(null, '字典名称', 'string', 1, 20),
        value: fnSchema(null, '字典值', 'string', 0, 500),
        symbol: fnSchema(null, '字典符号', 'string', 0, 20, ['string', 'number']),
        thumbnail: fnSchema(schemaField.image, '字典缩略图'),
        describe: fnSchema(null, '字典描述', 'string', 0, 300)
    }
});
