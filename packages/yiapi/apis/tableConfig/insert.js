import fs from 'fs-extra';
import path from 'path';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { fieldType } from '../../config/fieldType.js';
import { fnSchema, fnTimestamp, fnClearInsertData, fnApiInfo, fnCamelCase } from '../../utils/index.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `添加${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `添加${metaConfig.name}接口`,
        type: 'object',
        properties: {
            code: fnSchema(schemaField.table_code, '表编码'),
            name: fnSchema(schemaField.describe, '表描述'),
            fields: {
                title: '表字段',
                type: 'array',
                minItems: 1,
                items: {
                    type: 'object',
                    properties: {
                        comment: fnSchema(schemaField.string1to50, '字段名'),
                        code: fnSchema(schemaField.table_code, '字段编码'),
                        type: fnSchema(null, '字段类型', 'string', 1, 30, Object.keys(fieldType)),
                        length: fnSchema(schemaField.min0, '长度'),
                        index: fnSchema(schemaField.boolEnum, '索引'),
                        unsigned: fnSchema(schemaField.boolEnum, '无符号'),
                        unique: fnSchema(schemaField.boolEnum, '唯一值')
                    },
                    required: ['comment', 'code', 'type']
                }
            }
        },
        required: ['code', 'name', 'fields']
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let tableFile = path.resolve(sysConfig.appDir, 'tables', req.body.code + '.json');

                // 判断表是否存在
                if (fs.existsSync(tableFile)) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: '该表已存在，请修改数据表名称'
                    };
                }

                let fieldsLen = req.body.fields.length;
                let fieldNames = [];
                let isAllPass = true;
                let checkMsg = '';
                let tableSchema = {
                    name: req.body.name,
                    fields: {}
                };
                for (let i = 0; i < fieldsLen; i++) {
                    let fieldData = req.body.fields[i];
                    if (fieldNames.includes(fieldData.code)) {
                        checkMsg = `表 ${req.body.code} 的 ${fieldData.code} 字段重复了`;
                        isAllPass = false;
                        break;
                    } else {
                        fieldNames.push(fieldData.code);
                        let data = {
                            type: fieldData.type,
                            comment: fieldData.comment,
                            default: fieldData.default,
                            options: []
                        };
                        // 只有大于 0，才使用 length 字段
                        if (fieldData.length > 0) {
                            data.length = fieldData.length;
                        }
                        if (fieldData.index === 1) {
                            data.options.push('index');
                        }
                        if (fieldData.unique === 1) {
                            data.options.push('unique');
                        }
                        if (fieldData.unsigned === 1) {
                            data.options.push('unsigned');
                        }
                        tableSchema.fields[fieldData.code] = data;
                    }
                }

                if (isAllPass === false) {
                    return {
                        ...codeConfig.INSERT_FAIL,
                        msg: checkMsg
                    };
                } else {
                    fs.outputJSONSync(tableFile, tableSchema);
                }

                return {
                    ...codeConfig.INSERT_SUCCESS
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.INSERT_FAIL;
            }
        }
    });
}
