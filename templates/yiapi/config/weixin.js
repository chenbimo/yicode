import { weixinPrivateKey } from './key.js';
export const weixinConfig = {
    // 商户
    merchant: {
        mchId_123456: {
            name: '商户1',
            mchId: '123456',
            serialNo: '123456789123456789123456',
            apiv3PrivateKey: '123456789123456789123456',
            privateKey: weixinPrivateKey
        },
        mchId_123457: {
            name: '商户2',
            mchId: '123456',
            serialNo: '123456789123456789123456',
            apiv3PrivateKey: '123456789123456789123456',
            privateKey: weixinPrivateKey
        }
    },
    // 公众号
    gongZhong: {
        appId_wx123456123456: {
            name: '公众号1',
            appId: 'wx123456123456',
            appSecret: '123456789123456789123456'
        },
        appId_wx123456123457: {
            name: '公众号2',
            appId: 'wx123456123456',
            appSecret: '123456789123456789123456'
        }
    }
};
