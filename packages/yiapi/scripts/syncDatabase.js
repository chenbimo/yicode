#!/usr/bin/env node
import url from 'node:url';
import { basename, resolve } from 'node:path';
import { readdirSync } from 'node:fs';
import fs from 'fs-extra';
import Knex from 'knex';
import fg from 'fast-glob';
import logSymbols from 'log-symbols';
import * as color from 'colorette';
import Ajv from 'ajv';
import localize from 'ajv-i18n';

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
    merge as _merge,
    isEmpty as _isEmpty
} from 'lodash-es';

import { fnImport, fnRequire, fnIsPortOpen } from '../utils/index.js';
import { fnImportAbsolutePath } from '../utils/fnImportAbsolutePath.js';
import { isObject } from '../utils/isObject.js';
import { isPlainObject } from '../utils/isPlainObject.js';
import { toSnakeCase } from '../utils/toSnakeCase.js';
import { system } from '../system.js';
import { appConfig } from '../config/app.js';
import { mysqlConfig } from '../config/mysql.js';
import { fieldType } from '../config/fieldType.js';

// 是否全部检测通过，未通过则不进行表创建
let isCheckPass = true;
// 判断自定义字段是否生效
let isCustomTablePass = false;

// 表字段名称限制
const fieldNameLimit = /^[a-z][a-z_0-9]*$/;

// 不能设置的字段
const denyFields = [
    //
    'id',
    'created_at',
    'updated_at',
    'deleted_at'
];

const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: true
});

// 同步数据库
async function syncDatabase() {
    // let isPortOpen = await fnIsPortOpen(3000);
    // console.log('🚀 ~ file: syncCoreDatabase.js:220 ~ syncCoreDatabase ~ isPortOpen:', isPortOpen);
    // if (!isPortOpen) {
    //     console.log(`${logSymbols.warning} 请停止应用后再同步！！！`);
    //     process.exit(1);
    // }
    // 定义数据库链接
    const mysql = await new Knex({
        client: 'mysql2',
        connection: {
            host: mysqlConfig.host,
            port: mysqlConfig.port,
            user: mysqlConfig.username,
            password: mysqlConfig.password,
            database: mysqlConfig.db
        },
        acquireConnectionTimeout: 30000,
        asyncStackTraces: true,
        debug: false,
        pool: {
            min: 3,
            max: 10
        }
    });

    const trx = await mysql.transaction();

    try {
        const tableRecords = await trx
            .table('INFORMATION_SCHEMA.TABLES')
            .where({
                TABLE_TYPE: 'BASE TABLE',
                TABLE_SCHEMA: mysql.client.database()
            })
            .select('TABLE_NAME');
        // 获取所有的表
        const allTableName = tableRecords.map((item) => item.TABLE_NAME);
        // 重置校验默认值
        isCheckPass = true;
        isCustomTablePass = false;

        // 检测校验表字段是否都正确
        // const allTableData = await fnGetTableData(allTableName);
        const allDbTable = [];
        // 验证所有表字段配置
        const sysDbFiles = readdirSync(resolve(system.yiapiDir, 'tables'));
        const appDbFiles = readdirSync(resolve(system.appDir, 'tables'));
        const allDbFiles = [
            //
            ...sysDbFiles.map((file) => {
                return {
                    prefix: 'sys_',
                    path: resolve(system.yiapiDir, 'tables', file)
                };
            }),
            ...appDbFiles.map((file) => {
                return {
                    prefix: '',
                    path: resolve(system.appDir, 'tables', file)
                };
            })
        ];
        const validateTable = ajv.compile(tableSchema);
        for (let file of allDbFiles) {
            const pureFileName = basename(file, '.js');
            if (pureFileName.test(/[a-z][a-zA-Z0-9_]/) === false) {
                console.log(`${logSymbols.warning} ${file} 文件名只能为 大小写字母+数字+下划线`);
                process.exit(1);
            }
            const tableFile = toSnakeCase(pureFileName.trim());
            const { tableName } = await fnImportAbsolutePath(file, 'tableName', '');
            const { tableData } = await fnImportAbsolutePath(file, 'tableData', {});

            if (!tableName) {
                console.log(`${logSymbols.warning} ${file} 文件的 tableName 必须有表名称`);
                process.exit(1);
            }

            if (tableName.endsWith('_temp')) {
                console.log(`${logSymbols.warning} ${file} 文件名不能以 _temp 结尾`);
                process.exit(1);
            }

            if (isObject(tableData) === false) {
                console.log(`${logSymbols.warning} ${file} 文件的 tableData 必须为对象结构`);
                process.exit(1);
            }

            if (isPlainObject(tableData || {}) === true) {
                console.log(`${logSymbols.warning} ${file} 文件的 tableData 必须为非空对象`);
                process.exit(1);
            }

            const validResult = validateTable(tableData);
            if (!validResult) {
                localize.zh(validateTable.errors);
                console.log(logSymbols.error, '[ ' + file + ' ] \n' + ajv.errorsText(validateTable.errors, { separator: '\n' }));
                process.exit(1);
            }
            allDbTable.push({
                tableFile: tableFile,
                tableName: tableName + '表'.replace('表表', '表'),
                tableData: tableData
            });
        }

        // 合并表参数
        for (let keyTable in allDbTable) {
            if (allDbTable.hasOwnProperty(keyTable) === false) continue;
            const tableItem = allDbTable[keyTable];
            const tableDataItem = allTableData[i];

            if (allTableName.includes(tableItem.tableFile) === true) {
                tableItem.tableFileTemp = tableItem.tableFile + '_temp';
            }

            // 判断新表是否存在，存在则删除，否则会报错
            if (allTableName.includes(tableItem.tableFileTemp) === true) {
                // 删除新表;
                await trx.schema.dropTableIfExists(tableItem.tableFileTemp);
            }

            // 删除旧表
            // await trx.schema.dropTableIfExists(tableItem.tableOldName);
            // 如果不存在表，则直接创建
            await trx.schema.createTable(tableItem.tableFileTemp || tableItem.tableFile, (table) => {
                // 设置数据表的字符集和编码
                table.charset('utf8mb4');
                table.collate('utf8mb4_general_ci');
                // 设置表名称
                table.comment(tableItem.tableName);
                // 默认每个表的 ID 为自增流水号
                if (appConfig.tablePrimaryKey === 'default') {
                    table.increments('id');
                }
                if (appConfig.tablePrimaryKey === 'time') {
                    table.bigint('id').primary().notNullable().unsigned().comment('主键 ID');
                }
                // 设置时间
                table.bigint('created_at').index().notNullable().unsigned().defaultTo(0).comment('创建时间');
                table.bigint('updated_at').index().notNullable().unsigned().defaultTo(0).comment('更新时间');
                table.bigint('deleted_at').index().notNullable().unsigned().defaultTo(0).comment('删除时间');

                // 处理每个字段
                for (let keyField in tableData) {
                    if (tableData.hasOwnProperty(keyField) === false) continue;
                    const fieldData = tableData[keyField];
                    let fieldHandler = null;
                    // 字符串
                    if (fieldData.field.type === 'string') {
                        if (fieldData.field.length !== undefined) {
                            fieldHandler = table['string'](keyField, fieldData.field.length);
                        } else if (fieldData.schema.max !== undefined) {
                            fieldHandler = table['string'](keyField, fieldData.schema.max);
                        } else {
                            fieldHandler = table['string'](keyField);
                        }
                    }
                    // 文本
                    if (['mediumText', 'text', 'bigText'].includes(fieldData.field.type) === true) {
                        fieldHandler = table['text'](keyField, fieldData.field.type.toLowerCase());
                    }
                    // 数字
                    if (['tinyInt', 'smallInt', 'int', 'mediumInt', 'bigInt'].includes(fieldData.field.type) === true) {
                        if (fieldData.field.type === 'int') {
                            fieldHandler = table['integer'](keyField);
                        } else {
                            fieldHandler = table[fieldData.field.type.toLowerCase()](keyField);
                        }
                        if (fieldData.field.isUnsigned !== false) {
                            fieldHandler = fieldHandler.unsigned();
                        }
                    }
                    // 小数
                    if (['float', 'double'].includes(fieldData.field.type) === true) {
                        fieldHandler = table[fieldData.field.type](keyField, fieldData.field.precision, fieldData.field.scale);
                        if (fieldData.field.isUnsigned !== false) {
                            fieldHandler = fieldHandler.unsigned();
                        }
                    }

                    // 设置不能为空、编码、注释
                    fieldHandler = fieldHandler.notNullable().collate('utf8mb4_general_ci').comment(fieldData.name);

                    // 设置默认值
                    if (fieldData.field.default !== undefined) {
                        fieldHandler = fieldHandler.defaultTo(fieldData.default);
                    }
                    // 设置索引
                    if (fieldData.isIndex === true) {
                        fieldHandler = fieldHandler.index();
                    }
                    // 设置唯一性
                    if (fieldData.isUnique === true) {
                        fieldHandler = fieldHandler.unique();
                    }
                }
            });

            // 如果创建的是新表，则把旧表的数据转移进来
            if (tableItem.tableFileTemp) {
                // 获取所有旧字段
                const allOldFieldsInfo = await mysql.table(tableItem.tableFile).columnInfo();
                const allOldFields = Object.keys(allOldFieldsInfo);
                // 获取当前的新字段
                const validFields = [
                    //
                    ...Object.keys(tableItem.tableData),
                    ...denyFields
                ];
                // 判断字段是否有调整，如果没有调整则不用进行数据转移
                let isFieldChange = false;
                // 判断字段是否有改动
                validFields.forEach((field) => {
                    if (allOldFields.includes(field) === false) {
                        isFieldChange = true;
                    }
                });
                // 提取所有旧字段跟新字段匹配的字段
                const allOldNames = allOldFields.filter((field) => {
                    return validFields.includes(field);
                });

                if (isFieldChange === true) {
                    const validFieldsRow = allOldNames.map((field) => '`' + field + '`').join(',');
                    // 移动数据
                    const moveData = await trx.raw(`INSERT INTO ${tableDataItem.tableFileTemp} (${validFieldsRow}) SELECT ${validFieldsRow} FROM ${tableDataItem.tableFile}`);
                    // 删除旧表，重命名新表
                    await trx.schema.dropTableIfExists(tableDataItem.tableFile);
                    await trx.schema.renameTable(tableDataItem.tableFileTemp, tableDataItem.tableFile);
                    console.log(`${logSymbols.success} ${color.greenBright(tableDataItem.tableFile)}(${color.blueBright(tableFile)}) ${color.yellowBright('数据已同步')}`);
                } else {
                    console.log(`${logSymbols.success} ${color.greenBright(tableDataItem.tableFile)}(${color.blueBright(tableFile)}) ${color.cyanBright('字段无改动')}`);
                }
            } else {
                console.log(`${logSymbols.success} ${color.greenBright(tableDataItem.tableFile)}(${color.blueBright(tableFile)}) ${color.redBright('空表已创建')}`);
            }
        }
        await trx.commit();
        await trx.destroy();
        console.log(`${logSymbols.success} 系统表全部操作完毕`);
        process.exit();
    } catch (err) {
        console.log('🚀 ~ syncCoreDatabase ~ err:', err);
        await trx.rollback();
        await trx.destroy();
        console.log(`${logSymbols.success} 系统表同步失败`);
        process.exit();
    }
}

export { syncDatabase };
