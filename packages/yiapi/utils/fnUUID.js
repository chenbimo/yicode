import { customAlphabet } from 'nanoid';
// 自定义初始化字符
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 26);
// 随机 hash 值
export function fnUUID(size = 26) {
    return nanoid(size);
}
