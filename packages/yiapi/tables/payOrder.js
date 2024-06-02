import { tableExtConfig } from '../config/tableExt.js';
import { paymentConfig } from '../config/payment.js';
import { productConfig } from '../config/product.js';

const paymentCodes = paymentConfig.map((item) => item.code);
const productCodes = [0, ...Object.values(productConfig)];

export const tableName = '支付订单表';
export const tableData = Object.assign(tableExtConfig.sys_pay_order || {}, {
    user_id: {
        name: '用户 ID',
        type: 'bigInt',
        default: 0,
        isIndex: true,
        min: 0
    },
    user_openid: {
        name: '支付者微信 openid',
        type: 'string',
        default: '',
        max: 100
    },
    order_no: {
        name: '订单号',
        type: 'bigInt',
        default: 0,
        isIndex: true,
        isUnique: true,
        min: 0
    },
    product_code: {
        name: '产品代号',
        type: 'bigInt',
        default: 0,
        isIndex: true,
        min: 0,
        enum: productCodes
    },
    pay_code: {
        name: '支付代号',
        type: 'bigInt',
        default: 0,
        isIndex: true,
        min: 0,
        enum: paymentCodes
    },
    transaction_id: {
        name: '业务 ID',
        type: 'string',
        default: '',
        max: 200
    },
    pay_total: {
        name: '支付总金额 (分)',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    origin_price: {
        name: '产品原价',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    buy_agent: {
        name: '邀请人',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    buy_amount: {
        name: '购买数量',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    buy_zhe: {
        name: '购买折扣（百分比：100为单位）',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    buy_coupon: {
        name: '购买优惠（减免金额：分）',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    buy_duration: {
        name: '购买时长 (秒）',
        type: 'bigInt',
        default: 0,
        min: 0
    },
    buy_note: {
        name: '购买备注',
        type: 'string',
        default: '',
        max: 100
    }
});
