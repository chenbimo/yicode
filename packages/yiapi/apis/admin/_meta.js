import { fnSchema } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export const metaConfig = {
    name: '管理员',
    schema: {
        id: fnSchema(schemaField.id, '唯一ID'),
        account: fnSchema(schemaField.account, '账号'),
        username: fnSchema(schemaField.username, '用户名'),
        password: fnSchema(schemaField.password, '密码'),
        nickname: fnSchema(schemaField.nickname, '昵称'),
        role_codes: fnSchema(schemaField.role_codes, '角色代码'),
        page: fnSchema(schemaField.page, '第几页'),
        limit: fnSchema(schemaField.limit, '每页多少条')
    }
};
