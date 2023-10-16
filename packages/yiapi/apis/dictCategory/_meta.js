import { fnSchema } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = {
    name: '字典分类',
    schema: {
        id: fnSchema(schemaField.id, '唯一ID'),
        page: fnSchema(schemaField.page, '第几页'),
        limit: fnSchema(schemaField.limit, '每页多少条'),
        state: fnSchema(schemaField.state, '是否启用'),
        code: fnSchema(schemaField.Aa123_d, '字典编码'),
        name: fnSchema(null, '字典分类名称', 'string', 1, 20),
        describe: fnSchema(null, '字典分类描述', 'string', 0, 300)
    }
};
