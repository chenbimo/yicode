import { createServer } from 'vite';

import path from 'path';
import { fnCliDir } from '../utils.js';

async function mainDev(options) {
    const server = await createServer({
        // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
        configFile: path.resolve(fnCliDir(), 'vite.config.js')
    });
    await server.listen();

    server.printUrls();
}

export { mainDev };
