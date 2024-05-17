// 核心模块
import { readdirSync } from 'node:fs';
import { resolve, basename } from 'node:path';
// 外部模块
import Ajv from 'ajv';
import localize from 'ajv-i18n';
import logSymbols from 'log-symbols';
// 内部模块
import { system } from '../system.js';
import { fnImportCoreConfig } from './fnImportCoreConfig.js';
import { fnImportCoreSchema } from './fnImportCoreSchema.js';

const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: true
});

// 验证配置文件
export const validateConfigSchema = async () => {
    const files = readdirSync(resolve(system.yiapiDir, 'config'));
    for (let file of files) {
        const pureFileName = basename(file, '.js');
        const configFile = await fnImportCoreConfig(pureFileName, {});
        const configData = configFile[pureFileName + 'Config'];
        if (!configData) {
            console.log('配置文件无效' + pureFileName);
            process.exit(1);
        }
        const schemaFile = await fnImportCoreSchema(pureFileName, {});
        const schemaData = schemaFile[pureFileName + 'Schema'];
        if (!schemaData) {
            console.log('验证文件无效' + pureFileName);
            process.exit(1);
        }
        const validResult = ajv.validate(schemaData, configData);
        if (!validResult) {
            localize.zh(ajv.errors);
            console.log(logSymbols.error, '[ ' + file + ' ] ' + ajv.errorsText(ajv.errors, { separator: '\n' }));
            process.exit(1);
        }
    }
};
