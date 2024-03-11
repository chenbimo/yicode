import path from 'node:path';
import { fnFileProtocolPath, fnOmit, fnImport } from './utils.js';
import { cliDir, appDir, srcDir, cacheDir } from './config.js';

// unocss相关配置
import { presetAttributify, presetUno, presetIcons } from 'unocss';
import transformerVariantGroup from '@unocss/transformer-variant-group';
import transformerCompileClass from '@unocss/transformer-compile-class';
import transformerDirectives from '@unocss/transformer-directives';

const { yiteConfig } = await fnImport(fnFileProtocolPath(path.resolve(srcDir, 'yite.config.js')), 'yiteConfig', {});
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
