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

const ajv = new Ajv({
    strict: false,
    allErrors: true,
    verbose: true,
    strictSchema: true,
    strictRequired: false
});

// 验证配置文件
export const validateConfigSchema = async () => {
    const files = readdirSync(resolve(system.yiapiDir, 'config'));
    for (let file of files) {
        const pureFileName = basename(file, '.js');
        const configData = await fnImportCoreConfig(pureFileName, {});
        console.log('🚀 ~ validateConfigSchema ~ data:', configData[pureFileName + 'Config']);
        // const validResult = ajv.validate(schema, config);
        // if (!validResult) {
        //     localize.zh(ajv.errors);
        //     console.log(logSymbols.error, '[ ' + file + ' ] ' + ajv.errorsText(ajv.errors, { separator: '\n' }));
        //     if (isBreak === true) {
        //         process.exit(1);
        //     }
        // }
    }
};
