import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = fnMeta(import.meta.url, {
    name: '用户',
    schema: {
        password: fnSchema(schemaField.password, '密码'),
        email: fnSchema(null, '邮箱', 'string', 5, 50),
        verify_code: fnSchema(null, '验证码', 'string', 6, 6),
        avatar: fnSchema(schemaField.image, '头像'),
        nickname: fnSchema(schemaField.string1to20, '昵称'),
        bio: fnSchema(schemaField.string0to50, '签名'),
        describe: fnSchema(schemaField.string0to500, '描述'),
        scan_qrcode_uuid: fnSchema(null, '扫码识别号', 'string', 5, 50)
    }
});
