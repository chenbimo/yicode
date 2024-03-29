import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';
import { appConfig } from '../../config/appConfig.js';
import { timeConfig } from '../../config/timeConfig.js';

const paymentCodes = appConfig.payment.map((item) => item.code);
const productCodes = [0, ...Object.values(appConfig.product)];

export const metaConfig = fnMeta(import.meta.url, {
    _name: '用户',
    order_no: fnSchema(schemaField.min1, '订单号'),
    // 微信H5
    page_url: fnSchema(null, '页面URL', 'string', 1, 1000),
    // 登录相关
    scan_qrcode_uuid: fnSchema(null, '扫码识别号', 'string', 5, 50),
    agent_id: fnSchema(schemaField.min0, '代理ID'),
    // 购买相关
    buy_duration: fnSchema(null, '时长代号', 'string', 1, 100),
    buy_amount: fnSchema(schemaField.min1, '购买数量'),
    product_code: fnSchema(null, '支付产品', 'integer', null, null, [0, ...productCodes]),
    pay_code: fnSchema(null, '支付代号', 'integer', null, null, [0, ...paymentCodes]),
    buy_note: fnSchema(null, '购买备注', 'string', 0, 20, '')
});
