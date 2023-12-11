import { fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export const metaConfig = fnMeta(import.meta.url, {
    _name: '管理员',
    account: fnSchema(schemaField.account, '账号'),
    username: fnSchema(schemaField.username, '用户名'),
    password: fnSchema(schemaField.password, '密码'),
    nickname: fnSchema(schemaField.nickname, '昵称'),
    role_codes: fnSchema(schemaField.role_codes, '角色码')
});
