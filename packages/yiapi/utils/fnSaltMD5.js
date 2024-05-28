import md5 from 'blueimp-md5';
import { appConfig } from '../config/app.js';
// 加盐的 md5 值
export function fnSaltMD5(value) {
    return md5(value, appConfig.md5Salt);
}
