import { secondTimeConfig } from '@yicode/yiapi/config/secondTime.js';
import { productConfig } from './product.js';
export const paymentConfig = [
    {
        // 产品名称
        name: '测试产品 - 月会员',
        // 产品代号
        product: productConfig.test,
        // 支付代号
        code: 1,
        // 时长 0=永久 非0=秒
        duration: secondTimeConfig.month,
        // 价格 分
        money: 1500
    },
    {
        // 产品名称
        name: '测试产品 - 永久会员',
        // 产品代号
        product: productConfig.test,
        // 支付代号
        code: 2,
        // 时长 0=永久 非0=秒
        duration: secondTimeConfig.forever,
        // 价格 分
        money: 4500
    }
];
