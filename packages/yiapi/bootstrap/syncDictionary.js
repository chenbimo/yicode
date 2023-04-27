import fp from 'fastify-plugin';

import {
    //
    groupBy as _groupBy,
    forEach as _forEach,
    find as _find,
    isEmpty as _isEmpty
} from 'lodash-es';

import { fnUUID, fnTimestamp, fnCamelCase } from '../utils/index.js';
import { appConfig } from '../config/appConfig.js';

// 同步字典目录
async function syncDictionary(fastify) {
    // 准备好表
    let dictionaryModel = fastify.mysql.table(`${appConfig.table.sys_dict}`);

    // 第一次请求菜单数据，用于创建一级菜单
    // TODO: 这里还需要进一步判断字典是否已存在
    let dictionaryData = await dictionaryModel.clone().select('id', 'category', 'code');

    let dictionaryParent = dictionaryData.filter((item) => item.category === 'root');
    let dictionaryChild = dictionaryData.filter((item) => item.category !== 'root');
    let dictionaryChildGroup = _groupBy(dictionaryChild, 'category');

    // 待添加的数据
    let insertDictionaryData = [];

    _forEach(appConfig.dictionary, (item, index) => {
        let rootData = _find(dictionaryParent, { code: fnCamelCase(item.code) });
        // 如果没找到父级，则添加
        if (!rootData) {
            insertDictionaryData.push({
                uuid: fnUUID(),
                symbol: 'string',
                is_system: 1,
                category: 'root',
                thumbnail: item.thumbnail || '',
                name: item.name,
                value: item.value,
                code: fnCamelCase(item.code),
                sort: index,
                describe: item.describe || '',
                content: item.content || '',
                created_at: fnTimestamp(),
                updated_at: fnTimestamp()
            });
            item.children.forEach((item2, index2) => {
                insertDictionaryData.push({
                    uuid: fnUUID(),
                    symbol: 'string',
                    is_system: 1,
                    category: fnCamelCase(item.code),
                    thumbnail: item2.thumbnail || '',
                    name: item2.name,
                    value: item2.value,
                    code: fnCamelCase(item2.code),
                    sort: index2,
                    describe: item2.describe || '',
                    content: item2.content || '',
                    created_at: fnTimestamp(),
                    updated_at: fnTimestamp()
                });
            });
        } else {
            let parentData = dictionaryChildGroup[item.code];
            // 如果找到了父级，则判断子字典是否存在
            item.children.forEach((item2, index2) => {
                let childrenData = _find(parentData, { code: fnCamelCase(item2.code) });
                if (!childrenData) {
                    insertDictionaryData.push({
                        uuid: fnUUID(),
                        symbol: 'string',
                        is_system: 1,
                        category: fnCamelCase(item.code),
                        thumbnail: item2.thumbnail || '',
                        name: item2.name,
                        value: item2.value,
                        code: fnCamelCase(item2.code),
                        sort: index2,
                        describe: item2.describe || '',
                        content: item2.content || '',
                        created_at: fnTimestamp(),
                        updated_at: fnTimestamp()
                    });
                }
            });
        }
    });

    if (_isEmpty(insertDictionaryData) === false) {
        await dictionaryModel.clone().insert(insertDictionaryData);
    }
}

async function plugin(fastify) {
    // 同步接口
    try {
        await syncDictionary(fastify);
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'syncDictionary', dependencies: ['mysql', 'redis', 'tool'] });
