import * as yiapi from '@yicode/yiapi';

export let metaConfig = {
    name: '资讯新闻',
    schema: {
        id: yiapi.utils.fnSchema(yiapi.schemaField.id, '资讯 ID'),
        page: yiapi.utils.fnSchema(yiapi.schemaField.page, '第几页'),
        limit: yiapi.utils.fnSchema(yiapi.schemaField.limit, '每页数量'),
        keyword: yiapi.utils.fnSchema(yiapi.schemaField.keyword, '搜索关键字'),
        category_id: yiapi.utils.fnSchema(yiapi.schemaField.id, '资讯分类'),
        title: yiapi.utils.fnSchema(yiapi.schemaField.title, '资讯标题'),
        describe: yiapi.utils.fnSchema(yiapi.schemaField.string0to500, '资讯描述'),
        thumbnail: yiapi.utils.fnSchema(yiapi.schemaField.image, '资讯缩略图'),
        content: yiapi.utils.fnSchema(yiapi.schemaField.content, '资讯正文')
    }
};
