import * as color from 'colorette';
import logSymbols from 'log-symbols';
import { isObject } from './isObject.js';
import { isFunction } from './isFunction.js';
import { fnApiInfo } from './fnApiInfo.js';

// 设置路由函数
export const fnRoute = (metaUrl, fastify, metaConfig, options) => {
    const apiInfo = fnApiInfo(metaUrl);
    const method = (options.method || 'post').toLowerCase();
    if (isObject(options.schemaRequest) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口的 schemaRequest 必须为一个对象，请检查`);
        process.exit();
    }
    if (isFunction(options.apiHandler) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口的 apiHandler 必须为一个函数，请检查`);
        process.exit();
    }
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
