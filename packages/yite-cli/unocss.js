import path from 'node:path';
import { fnFileProtocolPath, fnOmit, fnImport } from './utils.js';
import { cliDir, appDir, srcDir, yicodeDir, cacheDir } from './config.js';

// unocss相关配置
import { defineConfig as defineUnocssConfig, presetAttributify, presetUno, presetIcons } from 'unocss';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerCompileClass from '@unocss/transformer-compile-class';
import transformerDirectives from '@unocss/transformer-directives';

const { yiteConfig } = await fnImport(fnFileProtocolPath(path.resolve(yicodeDir, 'yite.config.js')), 'yiteConfig', {});
export const unocssConfig = Object.assign(
    {
        presets: [
            //
            presetUno(),
            presetAttributify()
        ],
        transformers: [
            //
            transformerDirectives(),
            transformerVariantGroup(),
            transformerCompileClass()
        ],
        rules: [
            //
            [
                //
                'absolute',
                {
                    position: 'absolute'
                }
            ],
            [
                //
                'relative',
                {
                    position: 'relative'
                }
            ]
        ]
    },
    yiteConfig?.unocssConfig || {}
);
