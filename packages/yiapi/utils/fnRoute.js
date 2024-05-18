import * as color from 'colorette';
import logSymbols from 'log-symbols';
// 设置路由函数
export const fnRoute = (metaUrl, fastify, metaConfig, options) => {
    const apiInfo = fnApiInfo(metaUrl);
    const method = (options.method || 'post').toLowerCase();
    if (!options.schemaRequest) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口没有 schemaRequest 属性，请检查`);
        process.exit(1);
    }
    if (!options.apiHandler) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口没有 apiHandler 属性，请检查`);
        process.exit(1);
    }
    if (!['get', 'post'].includes(method)) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 接口方法只能为 get 或 post 之一，请检查`);
        process.exit(1);
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
