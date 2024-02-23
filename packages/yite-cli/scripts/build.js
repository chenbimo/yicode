import { build } from 'vite';
import path from 'path';
import { cliDir } from '../config.js';

async function mainBuild(options) {
    await build({
        configFile: path.resolve(cliDir, 'vite.config.js')
    });
}

export { mainBuild };
