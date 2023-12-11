import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export const metaConfig = fnMeta(import.meta.url, {
    _name: '用户',
    password: fnSchema(schemaField.password, '密码'),
    email: fnSchema(null, '邮箱', 'string', 5, 50),
    verify_code: fnSchema(null, '验证码', 'string', 6, 6),
    avatar: fnSchema(schemaField.image, '头像'),
    nickname: fnSchema(null, '昵称', 'string', 0, 20),
    bio: fnSchema(null, '签名', 'string', 0, 200),
    describe: fnSchema(null, '描述', 'string', 0, 200),
    scan_qrcode_uuid: fnSchema(null, '扫码识别号', 'string', 5, 50)
});
