import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { system } from '../system.js';
import { toSnakeCase } from '../utils/toSnakeCase.js';
import { tableSchema } from './table.js';

const sysDbFiles = readdirSync(resolve(system.yiapiDir, 'tables'));
const propertieFields = {};

sysDbFiles.forEach((file) => {
    propertieFields[toSnakeCase('sys_' + file.replace('.js', ''))] = tableSchema;
});

export const tableExtSchema = {
    // 扩展系统表字段
    title: '系统表扩展字段',
    type: 'object',
    properties: propertieFields,
    additionalProperties: false
};
