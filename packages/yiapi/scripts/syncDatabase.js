#!/usr/bin/env node
import fs from 'fs-extra';
import url from 'node:url';
import path from 'node:path';
import fp from 'fastify-plugin';
import Knex from 'knex';
import fg from 'fast-glob';
import { SchemaInspector } from 'knex-schema-inspector';
import enquirer from 'enquirer';
import logSymbols from 'log-symbols';
import ora from 'ora';
import { merge as mergeAny } from 'merge-anything';

import {
    //
    replace as _replace,
    snakeCase as _snakeCase,
    intersectionBy as _intersectionBy,
    isEmpty as _isEmpty,
    concat as _concat,
    endsWith as _endsWith,
    padStart as _padStart,
    padEnd as _padEnd,
    every as _every,
    toNumber as _toNumber,
    isInteger as _isInteger,
    forOwn as _forOwn,
    uniq as _uniq,
    keys as _keys,
    omit as _omit,
    some as _some,
    startsWith as _startsWith,
    find as _find,
    intersection as _intersection
} from 'lodash-es';

import { fnImport, fnCloneAny } from '../utils/index.js';
import { appConfig } from '../config/appConfig.js';
import { sysConfig } from '../config/sysConfig.js';

// 是否全部检测通过，未通过则不进行表创建
let isCheckPass = true;

// 基础数据表字段
let baseFields = {
    // collate: 'utf8mb4_general_ci',
    increment: false,
    primary: false,
    unique: false,
    index: false,
    unsigned: false,
    notNullable: true
};

let baseValidFields = [
    //
    'type',
    'comment',
    'length',
    'default',
    'collate',
    'increment',
    'primary',
    'unique',
    'index',
    'unsigned',
    'notNullable'
];

let denyFields = ['id', 'created_at', 'updated_at', 'deleted_at', 'state'];

// 获取表定义
async function fnGetTableData(filePattern, fileDir, tablePrefix) {
    try {
        let tableFiles = fg.sync(filePattern, {
            onlyFiles: true,
            dot: false,
            absolute: true,
            cwd: fileDir
        });
        let tableData = [];
        for (let i = 0; i < tableFiles.length; i++) {
            let filePath = tableFiles[i];
            let fileUrl = url.pathToFileURL(filePath);
            // 路径案例：file:///D:/codes/git/chensuiyi/yiapi/tables/sysUser.js
            // 获取表名，如果是数字，则将数字跟前面的字母金挨着，保证表名是下划线风格
            let tableName = _replace(_snakeCase(path.basename(filePath, '.js')), /_(\d+)/gi, '$1');
            tableName = tablePrefix ? tablePrefix + tableName : tableName;
            // 获取表数据
            let { default: _default } = await fnImport(fileUrl, { default: null });
            let tableDataFields = fnCloneAny(_default);
            if (_isEmpty(tableDataFields) || _isEmpty(tableDataFields._meta) || _isEmpty(tableDataFields._meta.name)) {
                console.log(`${logSymbols.error} ${filePath} 表数据错误或缺少_meta属性，请检查`);
                isCheckPass = false;
            } else {
                tableDataFields._meta.table = tableName;
                tableDataFields._meta.charset = tableDataFields._meta.charset || 'utf8mb4';
                tableDataFields._meta.collate = tableDataFields._meta.collate || 'utf8mb4_general_ci';

                // 表对象
                tableData.push(tableDataFields);
            }
        }
        return tableData;
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js ~ line 92 ~ fnGetTableData ~ err', err);
        isCheckPass = false;
    }
}

// 合并表数据
async function fnMergeTableData(_appTableData, sysTableData, addonTableData) {
    try {
        let appTableData = [];

        for (let i = 0; i < _appTableData.length; i++) {
            // 当前循环到的项目表格数据
            let appTableItem = _appTableData[i];

            let prefix = null;

            if (_startsWith(appTableItem._meta.table, 'sys_')) {
                prefix = 'sys_';
            }

            if (_startsWith(appTableItem._meta.table, 'addon_')) {
                prefix = 'addon_';
            }

            // 如果不是对应前缀开头，则处理下一个
            if (prefix === null) {
                appTableData.push(appTableItem);
                continue;
            }

            let sameTableData = { sys_: sysTableData, addon_: addonTableData }[prefix];
            let sameTableName = { sys_: '系统表', addon_: '插件表' }[prefix];

            // 找系统表跟用户表同名的表数据
            let sameTableItem = _find(sameTableData, (sysItem) => {
                return sysItem._meta.table === appTableItem._meta.table;
            });

            // 如果有同名的系统表或插件表，则判断是否已经存在同名的表 否则不予处理
            if (sameTableItem) {
                let sameValidFields = _omit(sameTableItem, '_meta');
                let appValidFields = _omit(appTableItem, '_meta');
                let theSameFields = _intersection(_keys(sameValidFields), _keys(appValidFields));

                // 如果同名表的交集字段不为空，则提示字段不能相同，字段不能覆盖，只能合并
                if (_isEmpty(theSameFields) === false) {
                    console.log(`${logSymbols.error} ${appTableItem._meta.table} 表 ${theSameFields.join(',')} 字段不能跟同名${sameTableName}字段相同`);
                    isCheckPass = false;
                } else {
                    for (let i = 0; i < sameTableData.length; i++) {
                        if (sameTableData[i]._meta.table === appTableItem._meta.table) {
                            sameTableData[i] = mergeAny(sameTableItem, appValidFields);
                            break;
                        }
                    }
                }
            } else {
                console.log(`${logSymbols.warning} ${appTableItem._meta.table} 表没有与之同名的${sameTableName}，将会不予处理`);
            }
        }
        return appTableData;
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js ~ line 105 ~ fnMergeTableData ~ err', err);
        isCheckPass = false;
    }
}

// 所有表数据
async function fnAllTableData() {
    try {
        // 系统表数据
        let sysTableData = await fnGetTableData(['./tables/*.js', '!**/_*.js'], sysConfig.yiapiDir, 'sys_');
        let addonTableData = await fnGetTableData(['./addons/*/tables/*', '!**/_*.js'], sysConfig.appDir, 'addon_');
        let _appTableData = await fnGetTableData(['./tables/*', '!**/_*.js'], sysConfig.appDir);

        // 应用表跟系统表和插件表合并后的数据
        let appTableData = await fnMergeTableData(_appTableData, sysTableData, addonTableData);

        // 所有表数据
        let allTableData = _concat(sysTableData, appTableData, addonTableData);
        return allTableData;
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js ~ line 152 ~ fnAllTableData ~ err', err);
        isCheckPass = false;
    }
}

// 检测校验表格数据
async function fnCheckTableData(allTableData, allTables) {
    try {
        for (let i = 0; i < allTableData.length; i++) {
            let tableDataItem = allTableData[i];

            /**
             * 表名映射转换
             * 有时候有同名表，避免覆盖
             */
            let mapTable = appConfig.table[tableDataItem._meta.table];
            tableDataItem._meta.table = mapTable ? mapTable : tableDataItem._meta.table;

            tableDataItem._meta.tableNewName = null;

            // 如果存在表，则创建新表
            // 如果存在新表，则删除新表
            if (allTables.includes(tableDataItem._meta.table)) {
                tableDataItem._meta.tableNewName = tableDataItem._meta.table + '_new';
            }

            _forOwn(tableDataItem, (_fieldData, fieldName) => {
                let fieldData = mergeAny(fnCloneAny(baseFields), _fieldData);

                // 如果不是默认内置的字段名称，则对齐进行校验和补充
                if (denyFields.includes(fieldName) === true) {
                    console.log(`${logSymbols.error} ${tableDataItem._meta.name}（${tableDataItem._meta.table}）表 ${fieldName} 字段名称不能为 ${denyFields.join(',')} 其中之一`);
                    isCheckPass = false;
                }
                if (['_meta'].includes(fieldName) === false) {
                    // 获取字段的类型信息
                    let fieldInfo = sysConfig.tableFieldType[fieldData.type];
                    // 判断字段类型是否存在
                    if (!fieldInfo) {
                        console.log(`${logSymbols.error} ${tableDataItem._meta.name}（${tableDataItem._meta.table}）表 ${fieldName} 字段的 ${fieldData.type} 类型不存在`);
                        isCheckPass = false;
                    } else {
                        if (fieldData.type === 'string' && _isInteger(fieldData.length) === false) {
                            console.log(`${logSymbols.error} ${tableDataItem._meta.name}（${tableDataItem._meta.table}）表 ${fieldName} 字段必须设置 length 属性`);
                            isCheckPass = false;
                        }
                    }
                }
            });
        }
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js ~ line 155 ~ fnCheckTableData ~ err', err);
        isCheckPass = false;
    }
}

// 同步数据库
async function syncDatabase() {
    try {
        // 定义数据库链接
        let mysql = await new Knex({
            client: 'mysql2',
            connection: {
                host: appConfig.database.host,
                port: appConfig.database.port,
                user: appConfig.database.username,
                password: appConfig.database.password,
                database: appConfig.database.db
            },
            acquireConnectionTimeout: 30000,
            asyncStackTraces: true,
            debug: false,
            pool: {
                min: 3,
                max: 10
            }
        });

        let inspector = SchemaInspector(mysql);

        // 获取所有的表
        let allTables = await inspector.tables();

        let spinner = ora();

        // 重置校验默认值
        isCheckPass = true;

        // 判断是否有旧表，有则选择是否删除旧表
        let allOldTableNames = allTables.filter((table) => _endsWith(table, '_old'));

        let prompt = new enquirer.Toggle({
            message: '请确认表结构是否已全部升级完成？（谨慎操作，选择【是】，将会删除所有旧表）',
            enabled: '是',
            disabled: '否'
        });
        let isDone = await prompt.run();

        // 如果选择已升级完成，则删除掉所有旧表
        if (isDone === true) {
            for (let i = 0; i < allOldTableNames.length; i++) {
                await mysql.schema.dropTableIfExists(allOldTableNames[i]);
            }
        } else {
            process.exit(0);
            return;
        }

        let allTableData = await fnAllTableData();

        // 检测校验表字段是否都正确
        await fnCheckTableData(allTableData, allTables);

        // 如果检测没有通过，则不进行表相关操作
        if (isCheckPass === false) {
            console.log(`${logSymbols.warning} 请先处理完毕所有的错误提示内容`);
            process.exit();
            return;
        }

        // 合并表参数
        for (let i = 0; i < allTableData.length; i++) {
            let tableDataItem = allTableData[i];

            try {
                spinner.start(`${tableDataItem._meta.name}（${tableDataItem._meta.table}） 表处理中`);
                if (tableDataItem._meta.tableNewName) {
                    await mysql.schema.dropTableIfExists(tableDataItem._meta.tableNewName);
                }

                // 如果不存在表，则直接创建
                await mysql.schema.createTable(tableDataItem._meta.tableNewName || tableDataItem._meta.table, (table) => {
                    _forOwn(tableDataItem, (_fieldData, fieldName) => {
                        let fieldData = mergeAny(fnCloneAny(baseFields), _fieldData);

                        if (fieldName === '_meta') {
                            // 设置数据表的字符集和编码
                            table.charset(tableDataItem._meta.charset);
                            table.collate(tableDataItem._meta.collate);

                            // 默认每个表的ID字段自增
                            table.bigincrements('id', { primaryKey: true });

                            // 设置状态
                            table['tinyint']('state').notNullable().defaultTo(0).comment('状态(0:正常,1:禁用,2)');

                            // 设置时间
                            table['bigint']('created_at').notNullable().unsigned().defaultTo(0).comment('创建时间');
                            table['bigint']('updated_at').notNullable().unsigned().defaultTo(0).comment('更新时间');
                            table['bigint']('deleted_at').notNullable().unsigned().defaultTo(0).comment('删除时间');
                        } else {
                            // 获取字段的类型信息
                            let fieldInfo = sysConfig.tableFieldType[fieldData.type];
                            // 字段链式调用实例
                            let fieldItem = null;

                            // 判断字段类型是否可以设置长度
                            if (fieldData.length > 0 && fieldInfo.length === true) {
                                fieldItem = table[fieldData.type](fieldName, fieldData.length);
                            } else {
                                fieldItem = table[fieldData.type](fieldName);
                            }
                            // 唯一值约束
                            if (fieldData.unique !== false) fieldItem.unique();
                            // 索引
                            if (fieldData.index !== false) fieldItem.index();
                            // 无符号，只有数值类型有
                            if (fieldData.unsigned && fieldInfo.unsigned) fieldItem.unsigned();
                            // 是否可以为空
                            if (fieldInfo.nullable === true) {
                                fieldItem.nullable();
                            } else {
                                if (fieldData.notNullable !== false) fieldItem.notNullable();
                            }

                            if (fieldData.collate !== false) fieldItem.collate(tableDataItem._meta.collate);
                            if (fieldData.default !== false) fieldItem.defaultTo(fieldData.default);
                            if (fieldData.comment !== false) fieldItem.comment(fieldData.comment);
                        }
                    });
                });

                // 如果创建的是新表，则把旧表的数据转移进来
                if (tableDataItem._meta.tableNewName) {
                    // 获取当前的新字段
                    let validFields = _uniq(_concat(_keys(_omit(tableDataItem, ['_meta'])), ['id', 'created_at', 'updated_at', 'deleted_at']));

                    // 获取所有旧字段
                    let allOldFields = await inspector.columns(tableDataItem._meta.table);

                    // 提取所有旧字段跟新字段匹配的字段
                    let allOldNames = allOldFields
                        .filter((item) => {
                            return validFields.includes(item.column);
                        })
                        .map((item) => item.column);

                    let validFieldsRow = allOldNames.map((field) => '`' + field + '`').join(',');

                    let moveData = await mysql.raw(`INSERT INTO ${tableDataItem._meta.tableNewName} (${validFieldsRow}) SELECT ${validFieldsRow} FROM ${tableDataItem._meta.table}`);

                    // 删除旧表，重命名新表
                    await mysql.schema.renameTable(tableDataItem._meta.table, tableDataItem._meta.table + '_old');
                    await mysql.schema.renameTable(tableDataItem._meta.tableNewName, tableDataItem._meta.table);
                    spinner.succeed(`${tableDataItem._meta.name}（${tableDataItem._meta.table}） 表处理完成`);
                } else {
                    spinner.succeed(`${tableDataItem._meta.name}（${tableDataItem._meta.table}） 表处理完成`);
                }
            } catch (err) {
                console.log('🚀 ~ file: syncDatabase.js ~ line 395 ~ syncDatabase ~ err', err);
                spinner.fail(`${tableDataItem._meta.name}（${tableDataItem._meta.table}） 表处理失败`);
            }
        }
        await mysql.destroy();
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js ~ line 274 ~ syncDatabase ~ err', err);
    } finally {
        process.exit(0);
    }
}

export { syncDatabase };
