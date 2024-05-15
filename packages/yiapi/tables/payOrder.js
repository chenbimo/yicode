import { appConfig } from '../../config/appConfig.js';

const paymentCodes = appConfig.payment.map((item) => item.code);
const productCodes = [0, ...Object.values(appConfig.product)];

export default {
    name: '支付订单表',
    fields: {
        user_id: {
            name: '用户 ID',
            fieldDefault: 0,
            fieldType: 'bigint',
            schemaType: 'integer',
            minimum: 0,
            index: true
        },
        user_openid: {
            name: '支付者微信 openid',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 100
        },
        order_no: {
            name: '订单号',
            fieldDefault: '',
            fieldType: 'bigint',
            schemaType: 'integer',
            index: true,
            unique: true
        },
        product_code: {
            name: '产品代号',
            fieldDefault: 0,
            fieldType: 'int',
            minimum: 0,
            index: true,
            enum: productCodes
        },
        pay_code: {
            name: '支付代号',
            fieldDefault: 0,
            fieldType: 'int',
            schemaType: 'integer',
            minimum: 0,
            index: true,
            enum: paymentCodes
        },
        transaction_id: {
            name: '业务 ID',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 100
        },
        pay_total: {
            name: '支付总金额 (分)',
            fieldDefault: 0,
            fieldType: 'int',
            schemaType: 'integer',
            minimum: 0
        },
        origin_price: {
            name: '产品原价',
            fieldDefault: 0,
            fieldType: 'int',
            schemaType: 'integer',
            minimum: 0
        },
        buy_amount: {
            name: '购买数量',
            fieldDefault: 0,
            fieldType: 'int',
            schemaType: 'integer',
            minimum: 0
        },
        buy_zhe: {
            name: '购买折扣（百分比：100为单位）',
            fieldDefault: 0,
            fieldType: 'int',
            schemaType: 'integer',
            minimum: 0
        },
        buy_coupon: {
            name: '购买优惠（减免金额：分）',
            fieldDefault: 0,
            fieldType: 'int',
            schemaType: 'integer',
            minimum: 0
        },
        buy_duration: {
            name: '购买时长 (秒）',
            fieldDefault: 0,
            fieldType: 'int',
            schemaType: 'integer',
            minimum: 0
        },
        buy_note: {
            name: '购买备注',
            fieldDefault: '',
            fieldType: 'string',
            schemaType: 'string',
            maxLength: 100
        }
    }
};
