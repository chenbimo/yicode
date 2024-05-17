import { system } from '../system.js';
import { fnImportAppConfig } from '../utils/fnImportAppConfig.js';
import { fnMerge } from '../utils/fnMerger.js';

const { appConfig: importConfig } = await fnImportAppConfig('app', {});

export const appConfig = fnMerge(
    {
        // 应用名称
        appName: '易接口',
        // 加密盐
        md5Salt: 'yiapi-123456.',
        // 监听端口
        port: 3000,
        // 监听主机
        host: '127.0.0.1',
        // 超级管理员密码
        devPassword: 'dev123456',
        // 是否进行参数验证
        paramsCheck: false,
        // 是否显示接口文档
        isSwagger: false,
        // 是否开启微信支付
        isWxPay: false,
        // TODO: 考虑增加 uuid 类型以及不同的 uuid 格式
        // 数据库表主键方案 default（mysql 自带）time（时序 ID）
        tablePrimaryKey: 'default'
    },
    importConfig
);
