import { fnSchema, fnMeta } from '@yicode/yiapi/fn.js';
import { schemaField } from '@yicode/yiapi/config/schemaField.js';

export const metaConfig = fnMeta(import.meta.url, {
    _name: '资讯新闻',
    keyword: fnSchema(null, '搜索关键字', 'string', 0, 100),
    category_id: fnSchema(schemaField.id, '资讯分类'),
    title: fnSchema(null, '资讯标题', 'string', 0, 100),
    describe: fnSchema(null, '资讯描述', 'string', 0, 500),
    thumbnail: fnSchema(schemaField.image, '资讯缩略图'),
    content: fnSchema(null, '资讯正文', 'string', 0, 50000)
});
