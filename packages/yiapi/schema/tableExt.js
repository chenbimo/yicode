// 核心模块
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
// 外部模块
import { yd_string_snakeCase } from '@yicode/yidash';
// 内部模块
import { system } from '../system.js';
import { tableSchema } from './table.js';

const sysDbFiles = readdirSync(resolve(system.yiapiDir, 'tables'));
const propertieFields = {};

sysDbFiles.forEach((file) => {
    propertieFields[yd_string_snakeCase('sys_' + file.replace('.js', ''))] = tableSchema;
});

export const tableExtSchema = {
    // 扩展系统表字段
    title: '系统表扩展字段',
    type: 'object',
    properties: propertieFields,
    additionalProperties: false
};
