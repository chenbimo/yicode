// 内部模块
import url from 'node:url';
import { dirname, resolve } from 'node:path';
import { readdirSync } from 'node:fs';
// 外部模块
import fp from 'fastify-plugin';
import { isEmpty as _isEmpty } from 'lodash-es';
// 工具函数
import { fnImportAbsolutePath } from '../utils/fnImportAbsolutePath.js';
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
        const allApiMetaFiles = await fnAllApiFiles('meta');

        // 所有目录路径的数组
        const allApiMetaByValue = allApiMetaFiles.map((file) => {
            return file.replace('/_meta.js', '').replace(/.+\/apis/, '');
        });

        // 接口目录同步完毕后，重新查询一遍接口目录，拿到所有的接口目录
        const apis = await apiModel.clone().selectAll();

        // 所有接口目录数据
        const apiDirDb = apis.filter((item) => item.is_bool === 0);
        const apiDirDbByValue = toKeyBy(apiDirDb, 'value');

        const deleteApiDirData = [];
        const insertApiDirData = [];
        const updateApiDirData = [];

        // 找出所有需要删除的接口目录
        apiDirDb.forEach((item) => {
            if (allApiMetaByValue.includes(item.value) === false) {
                deleteApiDirData.push(item.id);
            }
        });

        for (let i = 0; i < allApiMetaFiles.length; i++) {
            const file = allApiMetaFiles[i];
            const apiDirName = file.replace('/_meta.js', '').replace(/.+\/apis/, '');

            // 如果数据库中存在当前接口目录，则进行添加或更新
            const { metaConfig } = await fnImportAbsolutePath(file, 'metaConfig', {});

            const apiMeta = {
                name: metaConfig.dirName,
                value: apiDirName,
                is_bool: 0,
                pid: 0,
                pids: '0'
            };

            if (apiDirDbByValue[apiDirName]) {
                // 如果数据库中已有此目录，则更新目录
                apiMeta.id = apiDirDbByValue[apiDirName].id;
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
        const apiDb = await apiModel.clone().selectAll();

        // 所有接口目录数据
        const apiDirDb = apiDb.filter((item) => item.is_bool === 0);
        const apiDirDbByValue = toKeyBy(apiDirDb, 'value');

        // 所有的接口数据
        const apiFileDb = apiDb.filter((item) => item.is_bool === 1);
        const apiFileValue = apiFileDb.map((item) => item.value);
        const apiFileByValue = toKeyBy(apiFileDb, 'value');

        // 将要删除的接口数据
        const deleteApiData = [];
        // 将要添加的接口数据
        const insertApiData = [];
        // 将要修改的数据
        const updateApiData = [];
        // 自动生成的接口路径
        const autoApiObject = {};

        // 找出所有需要删除的接口文件
        apiFileDb.forEach((item) => {
            if (allApiFileByValue.includes(item.value) === false) {
                deleteApiData.push(item.id);
            }
        });

        // 遍历项目接口文件
        for (let i = 0; i < allApiFiles.length; i++) {
            const file = allApiFiles[i];
            const apiFileName = basename(file, '.js');
            const apiDirName = dirname(file);
            const apiFileRoute = file.replace('.js', '').replace(/.+\/apis/, '');
            const apiDirRoute = dirname(apiFileRoute);
            const apiDirData = apiDirDbByValue[apiDirRoute] || {};

            const { metaConfig } = await fnImportAbsolutePath(resolve(apiDirName, '_meta.js'), 'metaConfig', {});

            if (apiFileValue.includes(apiFileRoute) === false) {
                // 如果当前接口在数据库中不存在，且没有添加过，则添加接口
                // 防止2个同名接口重复添加
                const apiParams = {
                    pid: 0,
                    name: metaConfig.apiNames[apiFileName] || '',
                    value: apiFileRoute,
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
                if (apiDirData?.id) {
                    apiParams.pid = apiDirData.id;
                    apiParams.pids = `0,${apiDirData.id}`;
                    apiParams.level = 2;
                }
                insertApiData.push(apiParams);
            } else {
                // 如果当前接口存在，且父级接口目录也存在，且父级pid为0的野生接口，则更新修改接口文件信息

                // 当前API数据
                const currentApi = apiFileByValue[apiFileRoute] || {};
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

        // 如果待删除接口大于0，则删除
        if (deleteApiData.length > 0) {
            await apiModel.clone().whereIn('id', deleteApiData).deleteData();
        }

        // 如果待增加接口大于0，则增加
        if (insertApiData.length > 0) {
            await apiModel.clone().insertData(insertApiData);
        }

        // 如果待更新接口大于0，则更新
        if (updateApiData.length > 0) {
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
