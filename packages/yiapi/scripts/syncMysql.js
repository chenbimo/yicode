#!/usr/bin/env node
// 内部模块
import url from 'node:url';
import { basename, resolve } from 'node:path';
import { readdirSync } from 'node:fs';
// 外部模块
import Knex from 'knex';
import logSymbols from 'log-symbols';
import * as color from 'colorette';
import Ajv from 'ajv';
import localize from 'ajv-i18n';
// 配置文件
import { system } from '../system.js';
import { appConfig } from '../config/app.js';
import { mysqlConfig } from '../config/mysql.js';
import { tableFieldConfig } from '../config/tableField.js';
import { tableSchemaConfig } from '../config/tableSchema.js';
import { tableSchema } from '../schema/table.js';
// 工具函数
import { fnImportAbsolutePath } from '../utils/fnImportAbsolutePath.js';
import { isObject } from '../utils/isObject.js';
import { isPlainObject } from '../utils/isPlainObject.js';
import { toSnakeCase } from '../utils/toSnakeCase.js';
import { toUnique } from '../utils/toUnique.js';
import { isArrayContain } from '../utils/isArrayContain.js';
import { isArrayDiff } from '../utils/isArrayDiff.js';
import { isString } from '../utils/isString.js';
import { isInteger } from '../utils/isInteger.js';
import { isNumber } from '../utils/isNumber.js';
import { isArray } from '../utils/isArray.js';

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
export const syncMysql = async () => {
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
        // 所有的表数据
        const allDbTable = [];
        // 所有表文件
        const sysDbFiles = readdirSync(resolve(system.yiapiDir, 'tables'));
        const appDbFiles = readdirSync(resolve(system.appDir, 'tables'));
        const allDbFiles = [
            //
            ...sysDbFiles.map((file) => {
                return {
                    prefix: 'sys_',
                    file: resolve(system.yiapiDir, 'tables', file)
                };
            }),
            ...appDbFiles.map((file) => {
                return {
                    prefix: '',
                    file: resolve(system.appDir, 'tables', file)
                };
            })
        ];
        ajv.validateSchema(tableSchema);
        const validateTable = ajv.compile(tableSchema);

        for (let item of allDbFiles) {
            const pureFileName = basename(item.file, '.js');
            if (/[a-z][a-zA-Z0-9_]/.test(pureFileName) === false) {
                console.log(`${logSymbols.warning} ${file} 文件名只能为 大小写字母+数字+下划线`);
                process.exit(1);
            }
            const tableFile = toSnakeCase(pureFileName.trim());
            const { tableName } = await fnImportAbsolutePath(item.file, 'tableName', '');
            const { tableData } = await fnImportAbsolutePath(item.file, 'tableData', {});

            if (!tableName) {
                console.log(`${logSymbols.warning} ${item.file} 文件的 tableName 必须有表名称`);
                process.exit(1);
            }

            if (tableName.endsWith('_temp')) {
                console.log(`${logSymbols.warning} ${item.file} 文件名不能以 _temp 结尾`);
                process.exit(1);
            }

            if (isObject(tableData) === false) {
                console.log(`${logSymbols.warning} ${item.file} 文件的 tableData 必须为对象结构`);
                process.exit(1);
            }

            if (isPlainObject(tableData || {}) === true) {
                console.log(`${logSymbols.warning} ${item.file} 文件的 tableData 必须为非空对象`);
                process.exit(1);
            }

            if (isArrayContain(Object.keys(tableData), denyFields) === true) {
                console.log(`${logSymbols.warning} ${item.file} 文件的 tableData 不能包含 ${denyFields} 字段`);
                process.exit(1);
            }

            const validResult = validateTable(tableData);
            if (!validResult) {
                localize.zh(validateTable.errors);
                console.log(logSymbols.error, '[ ' + item.file + ' ] \n' + ajv.errorsText(validateTable.errors, { separator: '\n' }));
                process.exit(1);
            }

            // 验证字段
            for (let keyField in tableData) {
                if (tableData.hasOwnProperty(keyField) === false) continue;
                const itemData = tableData[keyField];
                const keysField = Object.keys(itemData.field);
                const keysSchema = Object.keys(itemData.schema);
                const tableField = tableFieldConfig[itemData.field.type];
                const tableSchema = tableSchemaConfig[itemData.schema.type];
                const tableFieldDiff = isArrayDiff(keysField, tableField);
                if (['string'].includes(itemData.field.type)) {
                    if (itemData.field.default !== undefined && isString(itemData.field.default) === false) {
                        console.log(`${logSymbols.warning} ${item.file} 文件的 ${keyField} 字段的 field.default 属性必须为字符串`);
                        process.exit(1);
                    }
                }
                if (['tinyInt', 'smallInt', 'mediumInt', 'int', 'bigInt'].includes(itemData.field.type)) {
                    if (itemData.field.default !== undefined && isInteger(itemData.field.default) === false) {
                        console.log(`${logSymbols.warning} ${item.file} 文件的 ${keyField} 字段的 field.default 属性必须为整数`);
                        process.exit(1);
                    }
                }
                if (['float', 'double'].includes(itemData.field.type)) {
                    if (itemData.field.default !== undefined && isNumber(itemData.field.default) === false) {
                        console.log(`${logSymbols.warning} ${item.file} 文件的 ${keyField} 字段的 field.default 属性必须为数字`);
                        process.exit(1);
                    }
                }
                if (itemData.schema.type === 'string') {
                    if (itemData.schema.default !== undefined && isString(itemData.schema.default) === false) {
                        console.log(`${logSymbols.warning} ${item.file} 文件的 ${keyField} 字段的 schema.default 属性必须为字符串`);
                        process.exit(1);
                    }
                }
                if (itemData.schema.type === 'integer') {
                    if (itemData.schema.default !== undefined && isInteger(itemData.schema.default) === false) {
                        console.log(`${logSymbols.warning} ${item.file} 文件的 ${keyField} 字段的 schema.default 属性必须为整数`);
                        process.exit(1);
                    }
                }
                if (itemData.schema.type === 'number') {
                    if (itemData.schema.default !== undefined && isNumber(itemData.schema.default) === false) {
                        console.log(`${logSymbols.warning} ${item.file} 文件的 ${keyField} 字段的 schema.default 属性必须为数字`);
                        process.exit(1);
                    }
                }
                if (itemData.schema.type === 'array') {
                    if (itemData.schema.default !== undefined && isArray(itemData.schema.default) === false) {
                        console.log(`${logSymbols.warning} ${item.file} 文件的 ${keyField} 字段的 schema.default 属性必须为数组`);
                        process.exit(1);
                    }
                }
                if (tableFieldDiff.length > 0) {
                    console.log(`${logSymbols.warning} ${item.file} 文件的 ${keyField} 字段的 field 属性不能为 ${tableFieldDiff}`);
                    process.exit(1);
                }
                const tableSchemaDiff = isArrayDiff(keysField, tableField);
                if (tableSchemaDiff.length > 0) {
                    console.log(`${logSymbols.warning} ${item.file} 文件的 ${keyField} 字段的 schema 属性不能为 ${tableSchemaDiff} 中的值`);
                    process.exit(1);
                }
            }
            allDbTable.push({
                tableFile: tableFile,
                tableName: (tableName + '表').replace('表表', '表'),
                tableData: tableData
            });
        }

        // 合并表参数
        for (let keyTable in allDbTable) {
            if (allDbTable.hasOwnProperty(keyTable) === false) continue;
            const tableItem = allDbTable[keyTable];

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
                for (let keyField in tableItem.tableData) {
                    if (tableItem.tableData.hasOwnProperty(keyField) === false) continue;
                    const fieldData = tableItem.tableData[keyField];
                    let fieldHandler = null;
                    // 字符串
                    if (fieldData.field.type === 'string') {
                        if (fieldData.field?.length !== undefined) {
                            fieldHandler = table['string'](keyField, fieldData.field.length);
                        } else if (fieldData.schema?.max !== undefined) {
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
                        fieldHandler = table[fieldData.field.type](keyField, fieldData.field.precision || 8, fieldData.field.scale || 2);
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
                const allNewFields = [
                    //
                    ...Object.keys(tableItem.tableData),
                    ...denyFields
                ];
                // 判断字段是否有调整，如果没有调整则不用进行数据转移
                let isFieldChange = false;
                // 判断字段是否有改动
                allNewFields.forEach((field) => {
                    if (allOldFields.includes(field) === false) {
                        isFieldChange = true;
                    }
                });

                if (isFieldChange === true) {
                    // 提取所有旧字段跟新字段匹配的字段
                    const uniqueNewFields = toUnique(...allOldFields, ...allNewFields);
                    const validFieldsRaw = uniqueNewFields.map((field) => '`' + field + '`').join(',');
                    // 移动数据
                    const moveData = await trx.raw(`INSERT INTO ${tableItem.tableFileTemp} (${validFieldsRaw}) SELECT ${validFieldsRaw} FROM ${tableItem.tableFile}`);
                    // 删除旧表，重命名新表
                    await trx.schema.dropTableIfExists(tableItem.tableFile);
                    await trx.schema.renameTable(tableItem.tableFileTemp, tableItem.tableFile);
                    console.log(`${logSymbols.success} ${color.magentaBright(tableItem.tableFile)}(${color.blueBright(tableItem.tableName)}) ${color.yellowBright('数据已同步')}`);
                } else {
                    console.log(`${logSymbols.success} ${color.magentaBright(tableItem.tableFile)}(${color.blueBright(tableItem.tableName)}) ${color.blackBright('字段无改动')}`);
                }
            } else {
                console.log(`${logSymbols.success} ${color.magentaBright(tableItem.tableFile)}(${color.blueBright(tableItem.tableName)}) ${color.greenBright('空表已创建')}`);
            }
        }
        await trx.commit();
        await trx.destroy();
        console.log(`${logSymbols.success} ${mysqlConfig.db} 数据库表同步成功`);
        process.exit();
    } catch (err) {
        console.log('🚀 ~ syncMysql ~ err:', err);
        await trx.rollback();
        await trx.destroy();
        console.log(`${logSymbols.error} ${mysqlConfig.db} 数据库表同步失败`);
        process.exit();
    }
};
