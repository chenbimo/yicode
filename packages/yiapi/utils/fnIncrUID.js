import { randomInt } from 'node:crypto';
// 创建顺序自增唯一 ID
export function fnIncrUID() {
    const timestamp = Math.floor(Date.now() / 1000);
    const random = randomInt(100000, 999999);
    return `${timestamp}${random}`;
}
