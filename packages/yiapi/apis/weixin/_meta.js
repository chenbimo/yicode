import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';

export let metaConfig = fnMeta(import.meta.url, {
    _name: '用户',
    order_no: fnSchema(schemaField.min1, '订单号'),
    buy_amount: fnSchema(schemaField.min1, '购买数量'),
    pay_product: fnSchema(null, '支付产品', 'string', null, null, ['no']),
    from_product: fnSchema(null, '来自产品', 'string', null, null, ['no']),
    agent_id: fnSchema(schemaField.pid, '代理 ID'),
    scan_qrcode_uuid: fnSchema(null, '扫码识别号', 'string', 5, 50)
});
