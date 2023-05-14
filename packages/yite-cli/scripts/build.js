import { build } from 'vite';
import path from 'path';
import { cliDir } from '../config.js';

async function main() {
    await build({
        configFile: path.resolve(cliDir, 'vite.config.js')
    });
}

export { main };
