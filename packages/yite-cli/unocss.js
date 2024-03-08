import path from 'node:path';
import { fnFileProtocolPath, fnOmit, fnImport, fnRequire } from './utils.js';
import { cliDir, appDir, srcDir, cacheDir } from './config.js';

// unocss相关配置2
import { presetAttributify, presetUno, presetIcons } from 'unocss';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerCompileClass from '@unocss/transformer-compile-class';
import transformerDirectives from '@unocss/transformer-directives';

const { yiteConfig } = fnRequire('yite.config.js', {});
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
        rules: []
    },
    yiteConfig?.unocssConfig || {}
);
