// 内部模块
import url from 'node:url';
import { basename, dirname, resolve } from 'node:path';
import { readdirSync, readFileSync } from 'node:fs';
// 外部模块
import fp from 'fastify-plugin';
import { yd_is_object, yd_data_omitObj, yd_data_keyBy } from '@yicode/yidash';
// 工具函数
import { fnImportAbsolutePath } from '../utils/fnImportAbsolutePath.js';
import { fnIncrUID } from '../utils/fnIncrUID.js';
// 工具函数
// 配置文件
import { system } from '../system.js';
import { appConfig } from '../config/app.js';

// 获取所有接口文件
async function fnAllApiFiles(type) {
    const coreApiFiles = readdirSync(resolve(system.yiapiDir, 'apis'), { recursive: true });
    const appApiFiles = readdirSync(resolve(system.appDir, 'apis'), { recursive: true });

    const allApiFiles = [
        //
        ...coreApiFiles.map((file) => {
            return {
                where: 'core',
                filePath: resolve(system.yiapiDir, 'apis', file).replace(/\\+/gi, '/')
            };
        }),
        ...appApiFiles.map((file) => {
            return {
                where: 'app',
                filePath: resolve(system.appDir, 'apis', file).replace(/\\+/gi, '/')
            };
        })
    ];

    if (type === 'meta') {
        return allApiFiles
            .filter((item) => item.filePath.endsWith('/_meta.js') === true)
            .map((item) => {
                return {
                    where: item.where,
                    filePath: item.filePath,
                    filePathName: item.filePath.replace('/_meta.js', '').replace(/.+\/apis/, '')
                };
            });
    }

    if (type === 'api') {
        return allApiFiles
            .filter((item) => basename(item.filePath).startsWith('_') === false && item.filePath.endsWith('.js'))
            .map((item) => {
                return {
                    where: item.where,
                    filePath: item.filePath,
                    filePathName: item.filePath.replace('.js', '').replace(/.+\/apis/, '')
                };
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
        const allApiMetaByValue = allApiMetaFiles.map((item) => {
            return item.filePathName;
        });

        const apis = await apiModel.clone().selectAll();

        // 所有接口目录数据
        const apiDirDb = apis.filter((item) => item.is_bool === 0);
        const apiDirDbByValue = yd_data_keyBy(apiDirDb, 'value');

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
            const item = allApiMetaFiles[i];
            const apiDirName = item.filePathName;

            // 如果数据库中存在当前接口目录，则进行添加或更新
            const { metaConfig } = await fnImportAbsolutePath(item.filePath, 'metaConfig', {});

            if (yd_is_object(metaConfig) === false) {
                fastify.log.warn(`${metaFilePath} 文件的必须导出一个对象`);
                process.exit();
            }

            if (!metaConfig?.dirName) {
                fastify.log.warn(`${metaFilePath} 文件的 dirName 必须为有效的目录值`);
                process.exit();
            }

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

        // 只有主进程才操作一次
        if (!process.env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE === '0') {
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
                        .updateData(yd_data_omitObj(item, ['id', 'created_at']));
                });
                await Promise.all(updateBatchData);
            }
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
        const allApiFileByValue = allApiFiles.map((item) => {
            return item.filePathName;
        });

        const apiDb = await apiModel.clone().selectAll();

        // 所有接口目录数据
        const apiDirDb = apiDb.filter((item) => item.is_bool === 0);
        const apiDirDbByValue = yd_data_keyBy(apiDirDb, 'value');

        // 所有的接口数据
        const apiFileDb = apiDb.filter((item) => item.is_bool === 1);
        const apiFileDbByValue = yd_data_keyBy(apiFileDb, 'value');

        // 将要删除的接口数据
        const deleteApiData = [];
        // 将要添加的接口数据
        const insertApiData = [];
        // 将要修改的数据
        const updateApiData = [];
        const coreFileRoutes = [];

        // 找出所有需要删除的接口文件
        apiFileDb.forEach((item) => {
            if (allApiFileByValue.includes(item.value) === false) {
                deleteApiData.push(item.id);
            }
        });

        // 遍历项目接口文件
        for (let i = 0; i < allApiFiles.length; i++) {
            const item = allApiFiles[i];
            const apiFileName = basename(item.filePath, '.js');
            const apiDirName = dirname(item.filePath);
            const apiFileRoute = item.filePathName;
            const apiDirRoute = dirname(apiFileRoute);

            // 判断接口层次
            const apiFileSplit = apiFileRoute.split('/').filter((name) => name);
            if (apiFileSplit.length !== 2 && apiFileSplit.length !== 3) {
                fastify.log.warn(`${item.filePath} 接口嵌套只能为 2-3 层`);
                process.exit();
            }

            if (item.where === 'core') {
                coreFileRoutes.push(apiFileRoute);
            } else {
                if (coreFileRoutes.includes(apiFileRoute)) {
                    fastify.log.warn(`${item.filePath} 接口不能与内核接口同名`);
                    process.exit();
                }
            }

            // 当前接口的目录数据
            const apiDirData = apiDirDbByValue[apiDirRoute] || {};
            // 接口元数据
            const metaFilePath = resolve(apiDirName, '_meta.js');
            const { metaConfig } = await fnImportAbsolutePath(metaFilePath, 'metaConfig', {});

            if (yd_is_object(metaConfig?.apiNames) === false) {
                fastify.log.warn(`${metaFilePath} 文件的 apiNames 值必须为一个对象`);
                process.exit();
            }

            if (!metaConfig?.apiNames[apiFileName]) {
                fastify.log.warn(`${metaFilePath} 文件的 apiNames.${apiFileName} 接口缺少描述`);
                process.exit();
            }

            if (!apiFileDbByValue[apiFileRoute]) {
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
                    is_bool: 1
                };
                if (appConfig.tablePrimaryKey === 'time') {
                    apiParams.id = fnIncrUID();
                }
                if (apiDirData?.id) {
                    apiParams.pid = apiDirData.id;
                    apiParams.pids = `0,${apiDirData.id}`;
                }
                insertApiData.push(apiParams);
            } else {
                const currentApi = apiFileDbByValue[apiFileRoute] || {};
                const apiParams = {
                    id: currentApi.id,
                    pid: apiDirData.id,
                    pids: `0,${apiDirData.id}`,
                    name: metaConfig.apiNames[apiFileName] || '' || ''
                };
                updateApiData.push(apiParams);
            }
        }

        // 数据的同步只在主进程中操作
        if (!process.env.NODE_APP_INSTANCE || process.env.NODE_APP_INSTANCE === '0') {
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
                    return apiModel.clone().where('id', item.id).updateData(yd_data_omitObj(item, 'id'));
                });
                await Promise.all(updateBatchData);
            }
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
        await fastify.cacheApiData();
    } catch (err) {
        fastify.log.error(err);
    }
}
export default fp(plugin, { name: 'syncApi', dependencies: ['redis', 'mysql', 'tool'] });
