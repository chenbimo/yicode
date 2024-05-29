import * as color from 'colorette';
import logSymbols from 'log-symbols';
import { isObject } from './isObject.js';
import { isString } from './isString.js';
import { isFunction } from './isFunction.js';
import { fnApiInfo } from './fnApiInfo.js';

// 设置路由函数
export const fnRoute = (metaUrl, fastify, metaConfig, options) => {
    if (isString(metaUrl) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口的 fnRoute 函数第一个参数必须为 import.meta.url，请检查`);
        process.exit();
    }

    if (isObject(fastify) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口的 fnRoute 函数第二个参数必须为 fastify 实例，请检查`);
        process.exit();
    }

    if (!metaConfig?.dirName) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口的 fnRoute 函数第三个参数必须为 _meta.js 文件元数据，请检查`);
        process.exit();
    }

    if (isObject(options) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口的 fnRoute 函数第四个参数必须为 Object 对象，请检查`);
        process.exit();
    }

    if (isObject(options.schemaRequest) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口的 schemaRequest 必须为一个对象，请检查`);
        process.exit();
    }
    if (isFunction(options.apiHandler) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口的 apiHandler 必须为一个函数，请检查`);
        process.exit();
    }

    const apiInfo = fnApiInfo(metaUrl);
    const method = (options.method || 'post').toLowerCase();

    if (['get', 'post'].includes(method) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口方法只能为 get 或 post 之一，请检查`);
        process.exit();
    }

    options.schemaRequest.title = metaConfig.apiNames[apiInfo.pureFileName];

    const routeParams = {
        method: method,
        url: `/${apiInfo.pureFileName}`,
        schema: {
            summary: metaConfig.apiNames[apiInfo.pureFileName],
            tags: [apiInfo.parentDirName],
            response: options.schemaResponse || {}
        },
        handler: options.apiHandler
    };

    if (routeParams.method === 'get') {
        routeParams.schema.query = options.schemaRequest;
    } else {
        routeParams.schema.body = options.schemaRequest;
    }
    fastify.route(routeParams);
};
