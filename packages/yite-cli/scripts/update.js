import path from 'path';
import fs from 'fs-extra';
import got from 'got';
import pacote from 'pacote';
import logSymbols from 'log-symbols';

import { cacheDir, srcDir } from '../config.js';

async function mainUpdate(options) {
    try {
        let updateDir = path.resolve(cacheDir, 'npm-package');
        const metaData = await got.get(`https://registry.npmmirror.com/@yicode-template/yiadmin/latest`).json();
        let downMeta = await pacote.extract(metaData.dist.tarball, updateDir, {});
        fs.copySync(path.resolve(updateDir, 'page', 'internal'), path.resolve(srcDir, 'page', 'internal'));
        fs.copySync(path.resolve(updateDir, 'config', 'internal.js'), path.resolve(srcDir, 'config', 'internal.js'));
        fs.copySync(path.resolve(updateDir, 'utils', 'internal.js'), path.resolve(srcDir, 'utils', 'internal.js'));
        fs.copySync(path.resolve(updateDir, 'styles', 'internal.scss'), path.resolve(srcDir, 'styles', 'internal.scss'));
        console.log(logSymbols.success, '项目更新成功!');
    } catch (error) {
        console.log('🚀 ~ file: update.js:20 ~ mainUpdate ~ error:', error);
        console.log(logSymbols.error, '资源错误或不存在!');
    }
}

export { mainUpdate };
