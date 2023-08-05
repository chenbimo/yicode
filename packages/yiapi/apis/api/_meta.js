import { fnSchema } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = {
    name: '接口',
    schema: {
        page: fnSchema(schemaField.page, '第几页'),
        limit: fnSchema(schemaField.limit, '每页多少条')
    }
};
