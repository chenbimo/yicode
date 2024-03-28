// 微信商户配置
import { weixinPrivateKey } from './key.js';
export const weixinConfig = {
    // 商户配置
    mchId: '123456',
    serialNo: '123456789123456789123456',
    apiv3PrivateKey: '123456789123456789123456',
    privateKey: weixinPrivateKey,
    // 公众号配置
    appId: 'wx123456123456',
    appSecret: '123456789123456789123456',
    // 支付回调地址
    notifyUrl: ''
};
