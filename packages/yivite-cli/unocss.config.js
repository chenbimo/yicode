import path from 'path';

import { defineConfig, presetAttributify, presetUno, presetIcons } from 'unocss';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerCompileClass from '@unocss/transformer-compile-class';
import transformerDirectives from '@unocss/transformer-directives';

import { requireFrom } from './utils.js';
import { cliDir, appDir, srcDir, yicodeDir, cacheDir } from './config.js';

const yiviteConfig = requireFrom(path.resolve(yicodeDir, 'yivite.config.js'));

let unocssConfig = defineConfig(
    Object.assign(
        {
            presets: [
                //
                presetUno(),
                presetAttributify()
            ],
            transformers: [
                //
                transformerDirectives.default(),
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
        yiviteConfig?.unocssConfig || {}
    )
);

export default unocssConfig;
