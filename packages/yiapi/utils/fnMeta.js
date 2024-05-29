import * as color from 'colorette';
import logSymbols from 'log-symbols';

const schemaType = ['string', 'integer', 'number', 'array'];

// 接口元数据函数
export const fnMeta = (metaUrl, data) => {
    const apiInfo = fnApiInfo(metaUrl);
    if (_isPlainObject(data) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 元数据必须为对象类型，请检查`);
        process.exit();
    }
    if (!data._name) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 元数据没有 _name 属性，请检查`);
        process.exit();
    }
    if (_isString(data._name) === false) {
        console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} 元数据的 _name 属性必须为字符串，请检查`);
        process.exit();
    }

    _forOwn(_omit(data, ['_name']), (item, key) => {
        // 判断是否有标题
        if (!item.title) {
            console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} ${key} 参数缺少 title 名称，请检查`);
            process.exit();
        }

        // 判断参数类型
        if (schemaType.includes(item.type) === false) {
            console.log(`${logSymbols.error} ${color.blueBright(apiInfo.apiPath)} ${key} 参数只能为 ${schemaType.join(',')} 其中之一`);
            process.exit();
        }
    });

    const mergeData = _merge(data, {
        id: fnSchema(schemaField.id, '主键ID'),
        page: fnSchema(schemaField.page, '第几页'),
        limit: fnSchema(schemaField.limit, '每页多少条')
    });

    return mergeData;
};
