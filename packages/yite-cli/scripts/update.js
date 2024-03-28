import path from 'path';
import fs from 'fs-extra';
import got from 'got';
import pacote from 'pacote';
import logSymbols from 'log-symbols';

import { fnAppDir } from '../utils.js';

async function mainUpdate(options) {
    try {
        const appDir = fnAppDir(options.workdir);
        const updateDir = path.resolve(appDir, '.cache', 'npm-package');
        const metaData = await got.get(`https://registry.npmmirror.com/@yicode/yiadmin-template/latest`).json();
        // const downMeta = await pacote.extract(metaData.dist.tarball, updateDir, {});
        fs.copySync(path.resolve(updateDir, 'src', 'pages', 'internal'), path.resolve(appDir, 'src', 'pages', 'internal'));
        fs.copySync(path.resolve(updateDir, 'src', 'config', 'internal.js'), path.resolve(appDir, 'src', 'config', 'internal.js'));
        fs.copySync(path.resolve(updateDir, 'src', 'utils', 'internal.js'), path.resolve(appDir, 'src', 'utils', 'internal.js'));
        fs.copySync(path.resolve(updateDir, 'src', 'styles', 'internal.scss'), path.resolve(appDir, 'src', 'styles', 'internal.scss'));
        console.log(logSymbols.success, '项目更新成功!');
    } catch (error) {
        console.log('🚀 ~ file: update.js:20 ~ mainUpdate ~ error:', error);
        console.log(logSymbols.error, '资源错误或不存在!');
    }
}

export { mainUpdate };
