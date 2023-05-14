import { createServer } from 'vite';

import path from 'path';
import { cliDir } from '../config.js';

async function main() {
    const server = await createServer({
        // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
        configFile: path.resolve(cliDir, 'vite.config.js')
    });
    await server.listen();

    server.printUrls();
}

export { main };
