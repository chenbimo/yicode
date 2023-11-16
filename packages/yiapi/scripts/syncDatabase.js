#!/usr/bin/env node
import fs from 'fs-extra';
import url from 'node:url';
import path from 'node:path';
import Knex from 'knex';
import fg from 'fast-glob';
import { SchemaInspector } from 'knex-schema-inspector';
import logSymbols from 'log-symbols';
import * as color from 'colorette';

import {
    //
    replace as _replace,
    snakeCase as _snakeCase,
    concat as _concat,
    endsWith as _endsWith,
    isInteger as _isInteger,
    forOwn as _forOwn,
    uniq as _uniq,
    keys as _keys,
    isString as _isString,
    isArray as _isArray,
    merge as _merge
} from 'lodash-es';

import { fnImport, fnRequire, fnIsPortOpen } from '../utils/index.js';
import { appConfig } from '../config/appConfig.js';
import { sysConfig } from '../config/sysConfig.js';
import { fieldType } from '../config/fieldType.js';

// 是否全部检测通过，未通过则不进行表创建
let isCheckPass = true;
// 判断自定义字段是否生效
let isCustomTablePass = false;

// 名称限制
let nameLimit = /^[a-z][a-z_0-9]*$/;

// 不能设置的字段
let denyFields = [
    //
    'id',
    'created_at',
    'updated_at',
    'deleted_at',
    'state'
];

// 文本类型可用的值，
let textType = [
    //
    'text', // 默认 16KB
    'mediumtext', // 16MB
    'longtext' // 4GB
];

// 一个字段全部属性
// let oneField = {
//     type: 'integer',
//     comment: '字段',
//     length: 100,
//     default: 0,
//     index: true,
//     unique: true,
//     unsigned: true,
//     precision: 5,
//     scale: 5,
//     capacity: 'mediumtext'
// };

// 检测校验表格数据
async function fnGetTableData(allTableName) {
    try {
        let tableFilesSys = fg.sync(['./tables/*.json', '!**/_*.json'], {
            onlyFiles: true,
            dot: false,
            absolute: true,
            cwd: sysConfig.yiapiDir
        });
        let tableFilesUser = fg.sync(['./tables/*.json', '!**/_*.json'], {
            onlyFiles: true,
            dot: false,
            absolute: true,
            cwd: sysConfig.appDir
        });
        let tableFileAll = [...tableFilesSys, ...tableFilesUser];
        let allTableData = [];

        for (let i = 0; i < tableFileAll.length; i++) {
            let filePath = tableFileAll[i];
            let fileUrl = url.pathToFileURL(filePath);
            let prefix = '';

            if (filePath.indexOf('yiapi/tables') !== -1) {
                prefix = 'sys_';
            }

            let tableName = prefix + _replace(_snakeCase(path.basename(filePath, '.json')), /_(\d+)/gi, '$1');
            // 获取表数据
            // let { default: tableDataItem } = await fnImport(fileUrl, 'default', { default: {} }, { assert: { type: 'json' } });
            let tableDataItem = await fnRequire(filePath, {}, prefix ? 'core' : 'user');
            // 设置表名称、描述
            tableDataItem.tableName = tableName;
            tableDataItem.tableComment = tableDataItem.name;
            tableDataItem.tableNewName = null;
            tableDataItem.tableOldName = tableDataItem.tableName + '_old';
            // 用户表不能以sys_开头
            if (prefix !== 'sys_' && tableName.startsWith('sys_') === true) {
                console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）不能以 sys_ 开头`);
                isCheckPass = false;
            }
            // 使用自带的字段覆盖扩展的字段
            tableDataItem.fields = _merge(appConfig.table[tableName] || {}, tableDataItem.fields);
            // 校验系统用户表必须有test_field字段，用来避免数据库数据被破坏
            if (tableName === 'sys_user') {
                if (appConfig.table[tableName]?.test_field?.type) {
                    isCustomTablePass = true;
                } else {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表必须存在 test_field 字段，用于检测自定义字段是否生效，避免同步时删除已有字段`);
                }
            }
            // 如果存在表，则创建新表
            if (allTableName.includes(tableDataItem.tableName)) {
                tableDataItem.tableNewName = tableDataItem.tableName + '_new';
            }
            // 遍历每个字段
            // 补充该字段缺失的属性
            _forOwn(tableDataItem.fields, (fieldData, fieldName) => {
                // 如果不是默认内置的字段名称，则对其进行校验和补充
                if (denyFields.includes(fieldName) === true) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段名称不能为 ${color.yellowBright(denyFields.join(','))} 其中之一`);
                    isCheckPass = false;
                }
                // 规范字段名称
                if (nameLimit.test(fieldName) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段名称必须以 ${color.yellowBright('小写字母开头 + [小写字母 | 下划线 | 数字]')}，请检查`);
                    isCheckPass = false;
                }
                // 必须有字段类型
                if (fieldData.type === undefined) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段定义缺少 ${color.yellowBright('type')} 属性，请检查`);
                    isCheckPass = false;
                }
                // 不能为不存在的类型
                if (fieldType[fieldData.type] === undefined) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright(fieldData.type)} 类型不存在`);
                    isCheckPass = false;
                }
                // 索引只能为布尔值
                if (fieldData.index !== undefined && [true, false].includes(fieldData.index) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('index')} 属性只能为 true 或 false`);
                    isCheckPass = false;
                }
                // 唯一只能为布尔值
                if (fieldData.unique !== undefined && [true, false].includes(fieldData.unique) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('unique')} 属性只能为 true 或 false`);
                    isCheckPass = false;
                }
                // 无符号只能为布尔值
                if (fieldData.unsigned !== undefined && [true, false].includes(fieldData.unsigned) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('unsigned')} 属性只能为 true 或 false`);
                    isCheckPass = false;
                }
                // length 属性必须为大于 0 的整数
                if (fieldData.length !== undefined) {
                    if (_isInteger(fieldData.length) === false || fieldData.length < 0) {
                        console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('length')} 属性必须为大于或等于 0 的整数，请检查`);
                        isCheckPass = false;
                    }
                }

                // 字符串类型必须设置 length 长度
                if (fieldData.type === 'string' && (_isInteger(fieldData.length) === false || fieldData.length < 0)) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段必须有 ${color.yellowBright('length')} 属性，且其值必须为大于或等于 0 的整数`);
                    isCheckPass = false;
                }
                // 文本类型必须设置 capacity 容量字段
                if (fieldData.type === 'text' && textType.includes(fieldData.capacity) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段必须有 ${color.yellowBright('capacity')} 属性，且其值为 ${textType.join(',')} 之一`);
                    isCheckPass = false;
                }
                // 浮点类型精度必须为大于等于 0 的整数
                if (fieldData.type === 'float' && fieldData.precision !== undefined) {
                    if (_isInteger(fieldData.precision) === false || fieldData.precision < 0) {
                        console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('precision')} 属性必须为大于或等于 0 的整数`);
                        isCheckPass = false;
                    }
                }
                // 浮点类型小数位必须为大于等于 0 的整数
                if (fieldData.type === 'float' && fieldData.scale !== undefined) {
                    if (_isInteger(fieldData.scale) === false || fieldData.scale < 0) {
                        console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('scale')} 属性必须为大于或等于 0 的整数`);
                        isCheckPass = false;
                    }
                }
                // 必须有字段注释
                if (fieldData.comment === undefined) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段定义缺少 ${color.yellowBright('comment')} 属性，请检查`);
                    isCheckPass = false;
                }
                // 字段注释必须为字符串
                if (_isString(fieldData.comment) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('comment')} 属性必须为字符串，请检查`);
                    isCheckPass = false;
                }
                tableDataItem.fields[fieldName] = fieldData;
            });
            allTableData.push(tableDataItem);
        }
        return allTableData;
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js:279 ~ fnCheckTableField ~ err:', err);
        isCheckPass = false;
    }
}

// 同步数据库
async function syncDatabase() {
    // let isPortOpen = await fnIsPortOpen(3000);
    // console.log('🚀 ~ file: syncDatabase.js:220 ~ syncDatabase ~ isPortOpen:', isPortOpen);
    // if (!isPortOpen) {
    //     console.log(`${logSymbols.warning} 请停止应用后再同步！！！`);
    //     process.exit(1);
    // }
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
    let allTableName = await inspector.tables();
    let trx = await mysql.transaction();

    try {
        // 重置校验默认值
        isCheckPass = true;
        isCustomTablePass = false;

        // 检测校验表字段是否都正确
        let allTableData = await fnGetTableData(allTableName);

        // 如果检测没有通过，则不进行表相关操作
        if (isCheckPass === false || isCustomTablePass === false) {
            console.log(`${logSymbols.warning} ${color.red('请先处理完毕所有的错误提示内容')}`);
            process.exit();
            return;
        }

        // 合并表参数
        for (let i = 0; i < allTableData.length; i++) {
            let tableDataItem = allTableData[i];
            // 删除新表
            // await trx.schema.dropTableIfExists(tableDataItem.tableNewName);
            // 删除旧表
            // await trx.schema.dropTableIfExists(tableDataItem.tableOldName);
            // 如果不存在表，则直接创建
            await trx.schema.createTable(tableDataItem.tableNewName || tableDataItem.tableName, (table) => {
                // 设置数据表的字符集和编码
                table.charset('utf8mb4');
                table.collate('utf8mb4_general_ci');
                // 默认每个表的 ID 为自增流水号
                if (appConfig.tablePrimaryKey === 'default') {
                    table.increments('id');
                }
                if (appConfig.tablePrimaryKey === 'time') {
                    table.bigInteger('id').primary().notNullable().unsigned().comment('主键 ID');
                }
                // 设置状态
                table.tinyint('state').index().notNullable().defaultTo(0).comment('状态 (0:正常，1:禁用，2:其他)');
                // 设置时间
                table.bigInteger('created_at').index().notNullable().unsigned().defaultTo(0).comment('创建时间');
                table.bigInteger('updated_at').index().notNullable().unsigned().defaultTo(0).comment('更新时间');

                // 处理每个字段
                _forOwn(tableDataItem.fields, (fieldData, fieldName) => {
                    // 获取字段的类型信息
                    let fieldInfo = fieldType[fieldData.type] || {};
                    // 字段链式调用实例
                    let fieldItem = {};
                    // 产生实例
                    if (fieldData[fieldInfo.args?.[0]] !== undefined && fieldData[fieldInfo.args?.[1]] !== undefined) {
                        // 如果有 2 个参数
                        fieldItem = table[fieldData.type](fieldName, fieldData[fieldInfo.args[0]], fieldData[fieldInfo.args[1]]);
                    } else if (fieldData[fieldInfo.args?.[0]] !== undefined) {
                        // 如果有 1 个参数
                        fieldItem = table[fieldData.type](fieldName, fieldData[fieldInfo.args[0]]);
                    } else {
                        // 如果没有参数
                        fieldItem = table[fieldData.type](fieldName);
                    }
                    // 设置不能为空、编码、注释
                    fieldItem = fieldItem.notNullable().collate('utf8mb4_general_ci').comment(fieldData.comment);
                    // 设置默认值
                    if (fieldData.default !== undefined) {
                        fieldItem = fieldItem.defaultTo(fieldData.default);
                    }
                    // 数字类型，默认为有符号
                    if (fieldData.type === 'number' || fieldData.type === 'float') {
                        if (fieldData.unsigned !== false) {
                            fieldItem = fieldItem.unsigned();
                        }
                    }
                    // 设置索引
                    if (fieldData.index === true) {
                        fieldItem = fieldItem.index();
                    }
                    // 设置唯一性
                    if (fieldData.unique === true) {
                        fieldItem = fieldItem.unique();
                    }
                });
            });

            // 如果创建的是新表，则把旧表的数据转移进来
            if (tableDataItem.tableNewName) {
                // 获取当前的新字段
                let validFields = _uniq(_concat(_keys(tableDataItem.fields), ['id', 'created_at', 'updated_at']));
                // 获取所有旧字段
                let allOldFields = await inspector.columns(tableDataItem.tableName);
                // 提取所有旧字段跟新字段匹配的字段
                let allOldNames = allOldFields
                    .filter((item) => {
                        return validFields.includes(item.column);
                    })
                    .map((item) => item.column);
                let validFieldsRow = allOldNames.map((field) => '`' + field + '`').join(',');
                // 移动数据
                let moveData = await trx.raw(`INSERT INTO ${tableDataItem.tableNewName} (${validFieldsRow}) SELECT ${validFieldsRow} FROM ${tableDataItem.tableName}`);
                // 删除旧表，重命名新表
                await trx.schema.dropTableIfExists(tableDataItem.tableName);
                await trx.schema.renameTable(tableDataItem.tableNewName, tableDataItem.tableName);
            }
        }
        await trx.commit();
        await trx.destroy();
        console.log(`${logSymbols.success} 同步完成`);
        process.exit();
    } catch (err) {
        console.log('🚀 ~ file: syncDatabase.js:274 ~ syncDatabase ~ err:', err);
        await trx.rollback();
        await trx.destroy();
        console.log(`${logSymbols.success} 同步失败`);
        process.exit();
    }
}

export { syncDatabase };
