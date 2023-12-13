import { fnSchema, fnMeta } from '../../utils/index.js';
import { schemaField } from '../../config/schemaField.js';
import { appConfig } from '../../config/appConfig.js';
import { timeConfig } from '../../config/timeConfig.js';

const gongZhongHao = ['no', ...Object.keys(appConfig.weixin.gongZhong)];
const productNames = ['no', ...Object.keys(appConfig.product)];
const durationTime = Object.keys(timeConfig.second);

export const metaConfig = fnMeta(import.meta.url, {
    _name: '用户',
    order_no: fnSchema(schemaField.min1, '订单号'),
    // 微信H5
    page_url: fnSchema(null, '页面URL', 'string', 1, 1000),
    // 登录相关
    scan_qrcode_uuid: fnSchema(null, '扫码识别号', 'string', 5, 50),
    gong_zhong_hao: fnSchema(null, '公众号', 'string', null, null, null, gongZhongHao),
    from_product: fnSchema(null, '来自产品', 'string', null, null, productNames),
    agent_id: fnSchema(schemaField.min0, '代理ID'),
    // 购买相关
    buy_duration: fnSchema(null, '购买时长', 'string', null, null, null, durationTime),
    buy_amount: fnSchema(schemaField.min1, '购买数量'),
    buy_product: fnSchema(null, '支付产品', 'string', null, null, productNames),
    buy_note: fnSchema(null, '购买备注', 'string', 0, 100, '')
});
