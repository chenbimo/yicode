import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';

const { freeApisConfig: importConfig } = await fnImportAppConfig('freeApis', []);

export const freeApisConfig = [
    //
    '/',
    '/favicon.*',
    '/public/**',
    '/api/tool/tokenCheck',
    '/api/admin/login',
    '/api/weixin/loginCheck',
    '/api/weixin/getConfg',
    '/api/weixin/loginQrcode',
    '/api/weixin/message',
    '/api/weixin/payNotify',
    ...importConfig
];
