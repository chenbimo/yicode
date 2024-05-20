import { paymentConfig } from '../config/payment.js';
import { productConfig } from '../config/product.js';

const paymentCodes = paymentConfig.map((item) => item.code);
const productCodes = [0, ...Object.values(productConfig)];

export const tableName = '支付订单表';
export const tableData = {
    user_id: {
        name: '用户 ID',
        field: {
            type: 'bigInt',
            default: 0,
            isIndex: true
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    user_openid: {
        name: '支付者微信 openid',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    },
    order_no: {
        name: '订单号',
        field: {
            type: 'bigInt',
            default: 0,
            isIndex: true,
            isUnique: true
        },
        schema: {
            type: 'integer'
        }
    },
    product_code: {
        name: '产品代号',
        field: {
            type: 'bigInt',
            default: 0,
            isIndex: 0
        },
        schema: {
            type: 'integer',
            min: 0,
            enum: productCodes
        }
    },
    pay_code: {
        name: '支付代号',
        field: {
            type: 'bigInt',
            default: 0,
            isIndex: true
        },
        schema: {
            type: 'integer',
            min: 0,
            enum: paymentCodes
        }
    },
    transaction_id: {
        name: '业务 ID',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 200
        }
    },
    pay_total: {
        name: '支付总金额 (分)',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    origin_price: {
        name: '产品原价',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    buy_amount: {
        name: '购买数量',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    buy_zhe: {
        name: '购买折扣（百分比：100为单位）',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    buy_coupon: {
        name: '购买优惠（减免金额：分）',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    buy_duration: {
        name: '购买时长 (秒）',
        field: {
            type: 'bigInt',
            default: 0
        },
        schema: {
            type: 'integer',
            min: 0
        }
    },
    buy_note: {
        name: '购买备注',
        field: {
            type: 'string',
            default: ''
        },
        schema: {
            type: 'string',
            max: 100
        }
    }
};
