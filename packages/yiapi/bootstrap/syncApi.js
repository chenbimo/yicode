// 内部模块
import url from 'node:url';
import { dirname, resolve } from 'node:path';
import { readdirSync } from 'node:fs';
// 外部模块
import fp from 'fastify-plugin';
import { isEmpty as _isEmpty } from 'lodash-es';
// 工具函数
import { fnImport } from '../utils/index.js';
import { fnDelay } from '../utils/fnDelay.js';
import { fnIncrUID } from '../utils/fnIncrUID.js';
import { fnCloneAny } from '../utils/fnCloneAny.js';
// 工具函数
import { toKeyBy } from '../utils/toKeyBy.js';
// 配置文件
import { system } from '../system.js';
import { appConfig } from '../config/app.js';

// 获取所有接口文件
async function fnAllApiFiles(type) {
    const coreApiFiles = readdirSync(resolve(system.yiapiDir, 'apis'));
    const appApiFiles = readdirSync(resolve(system.appDir, 'apis'));

    const allApiFiles = [...coreApiFiles, ...appApiFiles].map((file) => file.replace(/\\+/gi, '/'));

    if (type === 'meta') {
        return allApiFiles.filter((file) => file.endWiths('/_meta.js'));
    }

    if (type === 'api') {
        return allApiFiles.filter((file) => {
            const fileName = basename(file);
            return !basename(file).startWiths('_');
        });
    }
}

// 同步接口目录
async function syncApiDir(fastify) {
    try {
        // 准备好表
        const apiModel = fastify.mysql.table('sys_api');

        // 所有的接口元数据文件，用来生成目录
        const allApiMeta = await fnAllApiFiles('meta');

        // 所有目录路径的数组
        const allApiMetaByValue = allApiMeta.map((file) => {
            return file.replace('/_meta.js', '').replace(/.+\/apis/, '');
        });

        // 接口目录同步完毕后，重新查询一遍接口目录，拿到所有的接口目录
        const apis = await apiModel.clone().selectAll();

        // 所有接口目录数据
        const apisDir = apis.filter((item) => item.is_bool === 0);
        const apiDirValue = apisDir.map((item) => item.value);
        const apiDirByValue = toKeyBy(apisDir, 'value');

        // 从数据库查出的，明确保留的接口
        const keepApiDataObject = [];
        // 将要删除的接口数据
        const deleteApiDirData = [];
        // 将要添加的接口数据
        const insertApiDirData = [];
        // 将要修改的数据
        const updateApiDirData = [];

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
            const apiDirName = file.replace('/_meta.js', '').replace(/.+\/apis/, '');

            // 如果数据库中存在当前接口目录，则进行添加或更新
            const { metaConfig } = await fnImport(url.pathToFileURL(file), {});

            const apiMeta = {
                name: metaConfig._name,
                value: apiDirName,
                is_bool: 0,
                pid: 0,
                pids: '0'
            };

            if (apiDirByValue[apiDirName]) {
                // 如果数据库中已有此目录，则更新目录
                apiMeta.id = apiDirByValue[apiDirName].id;
                updateApiDirData.push(apiMeta);
            } else {
                // 如果数据库中没有此目录，则添加目录
                if (appConfig.tablePrimaryKey === 'time') {
                    apiMeta.id = fnIncrUID();
                }
                insertApiDirData.push(apiMeta);
            }
        }

        // 如果待删除接口目录大于0，则删除
        if (deleteApiDirData.length > 0) {
            await apiModel.clone().whereIn('id', deleteApiDirData).deleteData();
        }

        // 如果待增加接口目录大于0，则增加
        if (insertApiDirData.length > 0) {
            await apiModel.clone().insertData(insertApiDirData);
        }

        // 如果待更新接口目录大于0，则更新
        if (updateApiDirData.length > 0) {
            const updateBatchData = updateApiDirData.map((item) => {
                return apiModel
                    .clone()
                    .where('id', item.id)
                    .updateData(toOmit(item, ['id', 'created_at']));
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
        const allApiFiles = await fnAllApiFiles('api');

        // 所有接口路径的数组
        const allApiFileByValue = allApiFiles.map((file) => {
            return file.replace('.js', '').replace(/.+\/apis/, '');
        });

        // 接口目录同步完毕后，重新查询一遍接口目录，拿到所有的接口目录
        const apis = await apiModel.clone().selectAll();

        // 所有接口目录数据
        const apisDir = apis.filter((item) => item.is_bool === 0);
        const apiDirValue = apisDir.map((item) => item.value);
        const apiDirByValue = toKeyBy(apisDir, 'value');

        // 所有的接口数据
        const apisFile = apis.filter((item) => item.is_bool === 1);
        const apiFileValue = apisFile.map((item) => item.value);
        const apiFileByValue = toKeyBy(apisFile, 'value');

        // 从数据库查出的，明确保留的接口
        const keepApiDataObject = [];
        // 将要删除的接口数据
        const deleteApiData = [];
        // 将要添加的接口数据
        const insertApiData = [];
        // 将要修改的数据
        const updateApiData = [];
        // 自动生成的接口路径
        const autoApiObject = {};

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
            const apiFileName = file.replace('.js', '').replace(/.+\/apis/, '');
            // 获得父级数据
            const apiDirData = apiDirByValue[dirname(apiFileName)] || {};

            const { apiName } = await fnImport(file, {});

            if (apiFileValue.includes(apiFileName) === false && !autoApiObject[apiFileName]) {
                // 如果当前接口在数据库中不存在，且没有添加过，则添加接口
                // 防止2个同名接口重复添加
                autoApiObject[apiFileName] = true;
                let apiParams = {
                    pid: 0,
                    name: apiName || '',
                    value: apiFileName,
                    sort: 0,
                    is_open: 0,
                    describe: '',
                    pids: '0',
                    level: 1,
                    is_bool: 1
                };
                if (appConfig.tablePrimaryKey === 'time') {
                    apiParams.id = fnIncrUID();
                }
                if (_isEmpty(apiDirData) === false) {
                    apiParams.pid = apiDirData.id;
                    apiParams.pids = `0,${apiDirData.id}`;
                    apiParams.level = 2;
                }
                insertApiData.push(apiParams);
            } else {
                // 如果当前接口存在，且父级接口目录也存在，且父级pid为0的野生接口，则更新修改接口文件信息
                if (!autoApiObject[apiFileName]) {
                    autoApiObject[apiFileName] = true;

                    // 当前API数据
                    const currentApi = apiFileByValue[apiFileName] || {};
                    if (_isEmpty(currentApi) === false) {
                        // 如果当前API不为空，且父级API不为空，且当前父级ID为0
                        if (_isEmpty(apiDirData) === false) {
                            const params = {
                                id: currentApi.id,
                                pid: apiDirData.id,
                                pids: `0,${apiDirData.id}`,
                                level: 2,
                                name: apiName || ''
                            };
                            updateApiData.push(params);
                        } else {
                            const params = {
                                id: currentApi.id,
                                pid: 0,
                                pids: `0`,
                                level: 1,
                                name: apiName || ''
                            };
                            updateApiData.push(params);
                        }
                    }
                }
            }
        }

        // 如果待删除接口大于0，则删除
        if (_isEmpty(deleteApiData) === false) {
            await apiModel.clone().whereIn('id', deleteApiData).deleteData();
        }

        // 如果待增加接口大于0，则增加
        if (_isEmpty(insertApiData) === false) {
            await apiModel.clone().insertData(insertApiData);
        }

        // 如果待更新接口大于0，则更新
        if (_isEmpty(updateApiData) === false) {
            const updateBatchData = updateApiData.map((item) => {
                return apiModel.clone().where('id', item.id).updateData(toOmit(item, 'id'));
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
        await fnDelay(500);
        await syncApiFile(fastify);
        await fnDelay(100);
        await fastify.cacheApiData();
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'syncApi', dependencies: ['redis', 'mysql', 'tool'] });
