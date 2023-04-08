// 初始化用到的菜单配置，请勿改动
import path from 'path';
import { merge as _merge, values as _values } from 'lodash-es';
import { mergeAndConcat } from 'merge-anything';

import { fnFileProtocolPath, fnImport } from '../utils/index.js';
import { systemConfig } from '../system.js';

let configPath = fnFileProtocolPath(path.resolve(systemConfig.appDir, 'config', 'dictionary.js'));
let { dictionaryConfig: importConfig } = await fnImport(configPath, 'dictionaryConfig', []);

const dictionaryConfig = _values(
    mergeAndConcat(
        {
            目录分类: {
                name: '目录分类',
                value: '',
                describe: '目录分类字典',
                code: 'treeCategory',
                children: [
                    {
                        name: '菜单',
                        value: '',
                        code: 'menu'
                    },
                    {
                        name: '接口',
                        value: '',
                        code: 'api'
                    }
                ]
            }
        },
        importConfig
    )
);

export { dictionaryConfig };
