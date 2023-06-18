import { resolve } from 'node:path';
import { getPackagesSync } from '@manypkg/get-packages';
import * as colors from 'colorette';
import ajv from 'ajv';
import localize from 'ajv-i18n';
import { monolageSchema } from './monolage.schema.js';

const ajv = new Ajv({ strict: false, messages: false });

const validate = ajv.compile(appConfigSchema);

// 获取配置数据
async function getMonolageConfig(_path) {
    try {
        if (_path.startsWith('file:') !== true) {
            _path = 'file:///' + _path.replace(/\\+/gi, '/');
        }
        let { monolageConfig } = await import(_path);
        return monolageConfig;
    } catch (err) {
        return {};
    }
}

let monolageConfig = await getMonolageConfig(resolve(process.cwd(), 'monolage.config.js'));

const valid = validate(monolageConfig);
console.log('🚀 ~ file: index.js:20 ~ dd:', dd);

// const { tool, packages, rootPackage, rootDir } = getPackagesSync(process.cwd());
// console.log('🚀 ~ file: index.js:4 ~ packages:', packages);
