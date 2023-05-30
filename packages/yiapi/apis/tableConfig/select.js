import path from 'path';
import fg from 'fast-glob';
import { replace as _replace, snakeCase as _snakeCase, forOwn as _forOwn } from 'lodash-es';

import { fnSchema, fnApiInfo, fnPageOffset, fnImport } from '../../utils/index.js';

import { appConfig } from '../../config/appConfig.js';
import { sysConfig } from '../../config/sysConfig.js';
import { codeConfig } from '../../config/codeConfig.js';
import { schemaField } from '../../config/schemaField.js';
import { metaConfig } from './_meta.js';

const apiInfo = await fnApiInfo(import.meta.url);

export const apiSchema = {
    summary: `查询${metaConfig.name}`,
    tags: [apiInfo.parentDirName],
    body: {
        title: `查询${metaConfig.name}接口`,
        type: 'object',
        properties: {
            page: fnSchema(schemaField.page, '第几页'),
            limit: fnSchema(schemaField.limit, '每页数量'),
            state: fnSchema(schemaField.state, '是否开启')
        },
        required: []
    }
};

export default async function (fastify, opts) {
    fastify.post(`/${apiInfo.pureFileName}`, {
        schema: apiSchema,
        handler: async function (req, res) {
            try {
                let tableFiles = fg.sync(['./tables/*.json'], {
                    onlyFiles: true,
                    dot: false,
                    absolute: true,
                    cwd: sysConfig.appDir
                });

                let rows = [];
                for (let i = 0; i < tableFiles.length; i++) {
                    let tableName = _replace(_snakeCase(path.basename(tableFiles[i], '.json')), /_(\d+)/gi, '$1');
                    // 获取表数据
                    let { default: tableSchema } = await fnImport(tableFiles[i], 'default', { default: {} }, { assert: { type: 'json' } });
                    tableSchema.code = tableName;
                    _forOwn(tableSchema.fields, (item, key) => {
                        if (!item.options) item.options = [];
                    });
                    rows.push(tableSchema);
                }

                return {
                    ...codeConfig.SELECT_SUCCESS,
                    data: {
                        total: tableFiles.length,
                        rows: rows,
                        page: req.body.page,
                        limit: req.body.limit
                    }
                };
            } catch (err) {
                fastify.log.error(err);
                return codeConfig.SELECT_FAIL;
            }
        }
    });
}
