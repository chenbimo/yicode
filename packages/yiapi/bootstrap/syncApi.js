// 内部模块
import url from 'node:url';
import path from 'node:path';
// 外部模块
import fg from 'fast-glob';
import fp from 'fastify-plugin';
import {
    //
    concat as _concat,
    keyBy as _keyBy,
    isEmpty as _isEmpty,
    omit as _omit
} from 'lodash-es';
// 工具函数
import {
    //
    getApiDirName,
    fnTimestamp,
    getApiFileName,
    fnAllApiMeta,
    fnAllApiFiles,
    fnImport,
    fnCloneAny,
    fnIncrUID
} from '../utils/index.js';
// 配置文件
import { appConfig } from '../config/appConfig.js';

// 同步接口目录
async function syncApiDir(fastify) {
    try {
        // 准备好表
        const apiModel = fastify.mysql.table('sys_api');

        // 所有的接口元数据文件，用来生成目录
        const allApiMeta = await fnAllApiMeta();

        // 所有目录路径的数组
        const allApiMetaByValue = allApiMeta.map((file) => {
            return getApiDirName(file);
        });

        // 接口目录同步完毕后，重新查询一遍接口目录，拿到所有的接口目录
        const apis = await apiModel.clone().select();

        // 所有接口目录数据
        const apisDir = apis.filter((item) => item.is_bool === 0);
        const apiDirValue = apisDir.map((item) => item.value);
        const apiDirByValue = _keyBy(apisDir, 'value');

        // 从数据库查出的，明确保留的接口
        let keepApiDataObject = [];
        // 将要删除的接口数据
        let deleteApiDirData = [];
        // 将要添加的接口数据
        let insertApiDirData = [];
        // 将要修改的数据
        let updateApiDirData = [];

        // 找出所有需要删除的接口目录
        apisDir.forEach((item) => {
            if (allApiMetaByValue.includes(item.value) === false) {
                deleteApiDirData.push(item.id);
            } else {
                if (keepApiDataObject.includes(item.value)) {
                    deleteApiDirData.push(item.id);
                } else {
                    keepApiDataObject.push(item.value);
                }
            }
        });

        for (let i = 0; i < allApiMeta.length; i++) {
            const file = allApiMeta[i];
            const apiDirName = getApiDirName(file);

            // 如果数据库中存在当前接口目录，则进行添加或更新
            const { metaConfig } = await fnImport(url.pathToFileURL(file), {});

            if (!metaConfig) {
                fastify.log.error(`缺少文件：${file}`);
                process.exit(1);
            }

            // 判断有无 name 字段
            if (!metaConfig?.name) {
                fastify.log.error(`错误文件：${file} 缺少 name 字段`);
                process.exit(1);
            }

            // 判断有无 schema 字段
            if (!metaConfig?.schema) {
                fastify.log.error(`错误文件：${file} 缺少 schema 字段`);
                process.exit(1);
            }

            let apiMeta = {};
            apiMeta.name = metaConfig.name;
            apiMeta.value = apiDirName;
            apiMeta.is_bool = 0;
            apiMeta.pid = 0;
            apiMeta.pids = '0';

            if (apiDirByValue[apiDirName]) {
                // 如果数据库中已有此目录，则更新目录
                apiMeta.id = apiDirByValue[apiDirName].id;
                apiMeta.updated_at = fnTimestamp();
                updateApiDirData.push(apiMeta);
            } else {
                // 如果数据库中没有此目录，则添加目录
                apiMeta.id = fnIncrUID();
                apiMeta.created_at = fnTimestamp();
                insertApiDirData.push(apiMeta);
            }
        }

        // 如果待删除接口目录大于0，则删除
        if (_isEmpty(deleteApiDirData) === false) {
            await apiModel.clone().whereIn('id', deleteApiDirData).delete();
        }

        // 如果待增加接口目录大于0，则增加
        if (_isEmpty(insertApiDirData) === false) {
            await apiModel.clone().insert(insertApiDirData);
        }

        // 如果待更新接口目录大于0，则更新
        if (_isEmpty(updateApiDirData) === false) {
            const updateBatchData = updateApiDirData.map((item) => {
                return apiModel
                    .clone()
                    .where('id', item.id)
                    .update(_omit(item, ['id', 'created_at']));
            });
            await Promise.all(updateBatchData);
        }
    } catch (err) {
        fastify.log.error(err);
        process.exit();
    }
}

// 同步接口目录和接口文件
async function syncApiFile(fastify) {
    try {
        // 准备好表
        const apiModel = fastify.mysql.table('sys_api');

        // 所有的接口文件，用来生成接口
        const allApiFiles = await fnAllApiFiles();

        // 所有接口路径的数组
        const allApiFileByValue = allApiFiles.map((file) => {
            return getApiFileName(file);
        });

        // 接口目录同步完毕后，重新查询一遍接口目录，拿到所有的接口目录
        const apis = await apiModel.clone().select();

        // 所有接口目录数据
        const apisDir = apis.filter((item) => item.is_bool === 0);
        const apiDirValue = apisDir.map((item) => item.value);
        const apiDirByValue = _keyBy(apisDir, 'value');

        // 所有的接口数据
        const apisFile = apis.filter((item) => item.is_bool === 1);
        const apiFileValue = apisFile.map((item) => item.value);
        const apiFileByValue = _keyBy(apisFile, 'value');

        // 从数据库查出的，明确保留的接口
        let keepApiDataObject = [];
        // 将要删除的接口数据
        let deleteApiData = [];
        // 将要添加的接口数据
        let insertApiData = [];
        // 将要修改的数据
        let updateApiData = [];
        // 自动生成的接口路径
        let autoApiObject = {};

        // 找出所有需要删除的接口文件
        apisFile.forEach((item) => {
            if (allApiFileByValue.includes(item.value) === false) {
                deleteApiData.push(item.id);
            } else {
                if (keepApiDataObject.includes(item.value)) {
                    deleteApiData.push(item.id);
                } else {
                    keepApiDataObject.push(item.value);
                }
            }
        });

        // 遍历项目接口文件
        // 使用 for 替代 forEach 遍历，不然代码不会同步执行
        for (let i = 0; i < allApiFiles.length; i++) {
            const file = allApiFiles[i];
            const apiFileName = getApiFileName(file);

            // 获得父级数据
            const parentApiData = apiDirByValue[path.dirname(apiFileName)] || {};

            const { apiSchema } = await fnImport(file, {});

            if (apiFileValue.includes(apiFileName) === false && !autoApiObject[apiFileName]) {
                // 如果当前接口在数据库中不存在，且没有添加过，则添加接口
                // 防止2个同名接口重复添加
                autoApiObject[apiFileName] = true;
                let apiParams = {
                    id: fnIncrUID(),
                    pid: 0,
                    name: apiSchema?.summary || '',
                    value: apiFileName,
                    sort: 0,
                    is_open: 0,
                    describe: '',
                    pids: '0',
                    level: 1,
                    is_bool: 1,
                    created_at: fnTimestamp(),
                    updated_at: fnTimestamp()
                };
                if (_isEmpty(parentApiData) === false) {
                    apiParams.pid = parentApiData.id;
                    apiParams.pids = `0,${parentApiData.id}`;
                    apiParams.level = 2;
                }
                insertApiData.push(apiParams);
            } else {
                // 如果当前接口存在，且父级接口目录也存在，且父级pid为0的野生接口，则更新修改接口文件信息
                if (!autoApiObject[apiFileName]) {
                    autoApiObject[apiFileName] = true;

                    // 当前API数据
                    let currentApi = apiFileByValue[apiFileName] || {};
                    if (_isEmpty(currentApi) === false) {
                        // 如果当前API不为空，且父级API不为空，且当前父级ID为0
                        if (_isEmpty(parentApiData) === false) {
                            let params = {
                                id: currentApi.id,
                                pid: parentApiData.id,
                                pids: `0,${parentApiData.id}`,
                                level: 2,
                                name: apiSchema?.summary || '',
                                updated_at: fnTimestamp()
                            };
                            updateApiData.push(params);
                        } else {
                            let params = {
                                id: currentApi.id,
                                pid: 0,
                                pids: `0`,
                                level: 1,
                                name: apiSchema?.summary || '',
                                updated_at: fnTimestamp()
                            };
                            updateApiData.push(params);
                        }
                    }
                }
            }
        }

        // 如果待删除接口大于0，则删除
        if (_isEmpty(deleteApiData) === false) {
            await apiModel.clone().whereIn('id', deleteApiData).delete();
        }

        // 如果待增加接口大于0，则增加
        if (_isEmpty(insertApiData) === false) {
            await apiModel.clone().insert(insertApiData);
        }

        // 如果待更新接口大于0，则更新
        if (_isEmpty(updateApiData) === false) {
            const updateBatchData = updateApiData.map((item) => {
                return apiModel.clone().where('id', item.id).update(_omit(item, 'id'));
            });
            await Promise.all(updateBatchData);
        }
    } catch (err) {
        fastify.log.error(err);
        process.exit();
    }
}

async function plugin(fastify) {
    // 同步接口
    try {
        await syncApiDir(fastify);
        await syncApiFile(fastify);
        // 将接口缓存到 redis 中
        await fastify.cacheTreeData();
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'syncApi', dependencies: ['mysql', 'redis', 'tool'] });
