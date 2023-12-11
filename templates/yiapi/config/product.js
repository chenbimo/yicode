import { timeConfig } from '@yicode/yiapi/timeConfig.js';
export const productConfig = {
    // 产品 - 测试产品
    testProduct: [
        {
            // 代号
            code: 'monthVip',
            // 名称
            name: '月会员',
            // 时长 0=永久 非0=秒
            duration: timeConfig.second.month,
            // 价格 分
            money: 1500,
            // 描述
            describe: '测试产品 - 月会员'
        },
        {
            // 代号
            code: 'foreverVip',
            // 名称
            name: '永久会员',
            // 时长 0=永久 非0=秒
            duration: timeConfig.second.forever,
            // 价格 分
            money: 4500,
            // 描述
            describe: '测试产品 - 年会员'
        }
    ]
};
