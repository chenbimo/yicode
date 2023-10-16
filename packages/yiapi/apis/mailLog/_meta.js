import { fnSchema } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = {
    name: '邮件日志',
    schema: {
        id: fnSchema(schemaField.id, '唯一ID'),
        page: fnSchema(schemaField.page, '第几页'),
        limit: fnSchema(schemaField.limit, '每页多少条'),
        state: fnSchema(schemaField.state, '是否启用')
    }
};
