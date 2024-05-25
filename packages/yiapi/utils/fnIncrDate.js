import { randomInt } from 'node:crypto';
import { format } from 'date-fns';
// 创建顺序自增唯一 ID
export function fnIncrDate() {
    const date = format(new Date(), 'yyyyMMddHHmmss');
    const random = randomInt(100000, 999999);
    return `${date}_${random}`;
}
