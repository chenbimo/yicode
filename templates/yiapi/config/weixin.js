import { weixinPrivateKey } from './key.js';
export const weixinConfig = {
    // 商户
    merchant: [
        {
            code: 'merchant-1',
            name: '商户1',
            mchId: '123456',
            serialNo: '123456789123456789123456',
            apiv3PrivateKey: '123456789123456789123456',
            privateKey: weixinPrivateKey
        }
    ],
    // 公众号
    account: [
        {
            code: 'gongzhong-1',
            name: '公众号1',
            appId: 'wx123456123456',
            appSecret: '123456789123456789123456'
        }
    ]
};
