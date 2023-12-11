import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';
import { schemaRegexp } from '../../config/schemaRegexp.js';

export let metaConfig = fnMeta(import.meta.url, {
    _name: '工具',
    to_email: fnSchema(schemaField.email, '邮箱地址'),
    email_type: fnSchema(null, '邮件类型', 'string', null, null, ['common', 'verify']),
    subject: fnSchema(null, '邮件标题', 'string', 1, 200),
    verify_name: fnSchema(null, '验证码名称', 'string', 2, 30, null, null, schemaRegexp.aA0),
    content: fnSchema(null, '邮件内容', 'string', 1, 5000)
});
