import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = fnMeta(import.meta.url, {
    name: '工具',
    schema: {
        to_email: fnSchema(schemaField.email, '邮箱地址'),
        email_type: fnSchema(null, '邮件类型', 'string', null, null, ['common', 'verify']),
        subject: fnSchema(schemaField.string1to200, '邮件标题'),
        verify_name: {
            title: '验证码名称',
            type: 'string',
            minLength: 2,
            maxLength: 30,
            pattern: '^[a-z][a-zA-Z0-9]*$'
        },
        content: fnSchema(schemaField.string1to1000, '邮件内容')
    }
});
