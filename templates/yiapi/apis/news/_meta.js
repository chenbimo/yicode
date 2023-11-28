import * as yiapi from '@yicode/yiapi';

export const metaConfig = yiapi.fnMeta(import.meta.url, {
    name: '资讯新闻',
    schema: {
        keyword: yiapi.fnSchema(yiapi.schemaField.keyword, '搜索关键字'),
        category_id: yiapi.fnSchema(yiapi.schemaField.id, '资讯分类'),
        title: yiapi.fnSchema(yiapi.schemaField.title, '资讯标题'),
        describe: yiapi.fnSchema(yiapi.schemaField.string0to500, '资讯描述'),
        thumbnail: yiapi.fnSchema(yiapi.schemaField.image, '资讯缩略图'),
        content: yiapi.fnSchema(yiapi.schemaField.content, '资讯正文')
    }
});
