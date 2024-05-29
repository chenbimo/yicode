import { fnSchema } from '@yicode/yiapi/fn.js';
export const metaConfig = {
    dirName: '微信',
    apiNames: {
        code2Session: '通过code换取session',
        getConfig: '获取页面配置',
        getJsapiTicket: '获取js票据',
        loginCheck: '登录检测',
        loginQrcode: '登录二维码',
        message: '回调消息',
        payCheck: '支付成功检测',
        payNotify: '支付成功同志',
        payQrcode: '支付二维码',
        phoneInfo: '手机信息'
    },
    tableData: {
        order_no: fnSchema({ name: '订单号', schema: { type: 'string', min: 1 } }),
        // 微信H5
        page_url: fnSchema({ name: '页面URL', schema: { type: 'string', min: 1, max: 1000 } }),
        // 登录相关
        scan_qrcode_uuid: fnSchema({ name: '扫码识别号', schema: { type: 'string', min: 5, max: 50 } }),
        agent_id: fnSchema({ name: '代理ID', schema: { type: 'integer', min: 1 } })
    }
};
