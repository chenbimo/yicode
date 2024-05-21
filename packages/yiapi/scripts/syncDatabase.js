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

// 文本类型可用的值，
const textType = [
    //
    'text', // 默认 16KB
    'mediumText', // 16MB
    'longtext' // 4GB
];

const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: true
});

// 检测校验表格数据
async function fnGetTableData(allTableName) {
    try {
        const tableFilesSys = fg.sync(['./tables/*.json', '!**/_*.json'], {
            onlyFiles: true,
            dot: false,
            absolute: true,
            cwd: system.yiapiDir
        });
        const tableFileAll = tableFilesSys.map((file) => {
            return {
                prefix: 'sys_',
                path: file
            };
        });
        const allTableData = [];

        for (let i = 0; i < tableFileAll.length; i++) {
            const fileItem = tableFileAll[i];
            const prefix = fileItem.prefix;
            const filePath = fileItem.path;
            const fileUrl = url.pathToFileURL(filePath);

            const tableName = prefix + _replace(_snakeCase(basename(filePath, '.json')), /_(\d+)/gi, '$1');
            // 获取表数据
            const tableDataItem = await fnRequire(filePath, {}, 'core');
            // 设置表名称、描述
            tableDataItem.tableName = tableName;
            tableDataItem.tableComment = tableDataItem.name;
            tableDataItem.tableNewName = null;
            tableDataItem.tableOldName = tableDataItem.tableName + '_old';
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
                if (fieldNameLimit.test(fieldName) === false) {
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
                if (fieldData.name === undefined) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段定义缺少 ${color.yellowBright('name')} 属性，请检查`);
                    isCheckPass = false;
                }
                // 字段注释必须为字符串
                if (_isString(fieldData.name) === false) {
                    console.log(`${logSymbols.warning} ${color.blueBright(tableDataItem.tableComment)}（${color.cyanBright(tableDataItem.tableName)}）表 ${color.greenBright(fieldName)} 字段的 ${color.yellowBright('name')} 属性必须为字符串，请检查`);
                    isCheckPass = false;
                }
                tableDataItem.fields[fieldName] = fieldData;
            });
            allTableData.push(tableDataItem);
        }
        return allTableData;
    } catch (err) {
        console.log('🚀 ~ fnGetTableData ~ err:', err);
        isCheckPass = false;
    }
}

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
                    ...['id', 'created_at', 'updated_at', 'deleted_at']
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
